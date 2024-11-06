const { faker } = require("@faker-js/faker");
const createReceivents = require("./createReceivents");
const { USERS, POSSIBLE_ORDER_STATUSES } = require("./consts");
const createOrderDeviceCombinations = require("./createOrderDeviceCombinations");
const createOrderName = require("./createOrderName");
const { parsePhoneNumber } = require("libphonenumber-js");
const createOrderCourierDelivery = require("./createOrderCourierDelivery");
const _ = require("lodash");

module.exports = (
  devices, deviceCombinations, cartDeviceCombinations, sellers, 
  deliveries, deliveryTypes, cities, streets, storePickupPoints,
  courierSchedules, saleDevices, sales, saleTypes, saleTypeNames) => {
  let orders = [];
  let orderCourierDeliveries = [];
  let orderDeviceCombinations = [];

  const receivents = createReceivents();

  // logic from the useGettingOrders() hook on the client to correctly distribute orders
  // that contain different devices by their "type"
  // ["default"], ["preOrder"], ["withNonDiscountSale"] or ["preOrder", "withNonDiscountSale"]
  // to handle them without any bugs on the client
  const combinationSellerIds = cartDeviceCombinations?.map(combo => {
    const device = devices.find(dev => dev.id === combo.deviceId);
    const seller = sellers.find(sell => sell.id === device.sellerId);

    return seller.id;
  }) || [];

  const uniqueCombinationSellerIds = Array.from(new Set(combinationSellerIds));

  let allOrderInfos = [];

  // preorder cart combos and ones with non-discount sales
  let preOrderCartCombos = [];
  let nonDiscountSaleCartCombosObj = {};

  // filter fn to separate cart combos of different sellers
  function cartCombosFilterFn(combo, sellerId, isDefault = true) {
    const device = devices.find(dev => dev.id === combo.deviceId);

    const isPreOrder = device.isPreOrder;
    let isWithNonDiscountSale = false;
    let nonDiscountSaleName;

    const devSaleDevices = saleDevices.filter(saleDev => saleDev.deviceId === device.id);

    if (devSaleDevices?.length) {
      let deviceSaleTypes = [];
      
      // we iterate through its sales
      for (let sale of devSaleDevices) {
        // find our sale
        const deviceSale = sales?.find(s => s.id === sale.saleId);
        const currDeviceSaleTypes = saleTypes.filter(type => type.saleId === deviceSale.id);

        if (deviceSale) {
          for (let type of currDeviceSaleTypes) {
            // searching for type's name
            const name = saleTypeNames?.find(typeName => typeName.id === type.saleTypeNameId)?.name;
            if (name) {
              let existingSaleType = deviceSaleTypes.find(saleType => saleType.saleTypeNameId === type.saleTypeNameId);

              if (existingSaleType) {
                const existingTypeTimestamp = Date.parse(existingSaleType.createdAt);
                const currentTypeTimestamp = Date.parse(type.createdAt);
    
                // if a type in the loop is newer than existing one override last one with it 
                if (currentTypeTimestamp > existingTypeTimestamp) {
                  existingSaleType = { ...type, "name": name, "createdAt": deviceSale.createdAt };
                }
              } else {
                // and pushing sale types to the deviceSaleTypes array
                // they have fields such a sale icon and discount percentage
    
                // creating "createdAt" field to handle multiple sale types of the same type name
                // for example, multiple discount percentages (old one overrides with new one)
                deviceSaleTypes.push({ ...type, "name": name, "createdAt": deviceSale.createdAt });
              }
            }
          }
        }
      }

      if (deviceSaleTypes) {
        for (let saleType of deviceSaleTypes) {
          const saleTypeName = saleTypeNames?.find(
            typeName => typeName.id === saleType.saleTypeNameId
          );

          if (isDefault && !!saleTypeName?.name && saleTypeName?.name !== "discount") {
            isWithNonDiscountSale = true;
            nonDiscountSaleName = saleTypeName?.name;

            if (!nonDiscountSaleCartCombosObj[nonDiscountSaleName]?.length) {
              nonDiscountSaleCartCombosObj[nonDiscountSaleName] = [];
            }
          }
        }
      }
    }

    if (isDefault) {
      const isAlreadyEncounteredPreOrderCombo = !!preOrderCartCombos.find(existingCombo => existingCombo.id === combo.id);
      if (isPreOrder && !isAlreadyEncounteredPreOrderCombo) preOrderCartCombos.push(combo);

      const isAlreadyEncounteredNonDiscountSaleCombo = !!Object.values(nonDiscountSaleCartCombosObj)?.find(
        values => !!values?.find(value => value.id === combo.id)
      );

      if (
        isWithNonDiscountSale && nonDiscountSaleName
        && !isAlreadyEncounteredNonDiscountSaleCombo
      ) {
        nonDiscountSaleCartCombosObj[nonDiscountSaleName].push(combo);
      }
    }

    let passingComboCondition = !isPreOrder && !isWithNonDiscountSale && device.sellerId === sellerId;
    if (!isDefault) {
      passingComboCondition = device.sellerId === sellerId;
    }

    return passingComboCondition;
  }

  for (let sellerId of uniqueCombinationSellerIds) {
    if (sellerId === undefined || sellerId === null) return;
    // adding a new combo if the possible result is not empty 
    const possibleResult = cartDeviceCombinations?.filter(combo => cartCombosFilterFn(combo, sellerId));
    const defaultOrderCombos = _.chunk(possibleResult?.length ? possibleResult : [], 3);

    if (defaultOrderCombos?.length) {
      for (let orderCombos of defaultOrderCombos) {
        allOrderInfos.push({ combos: orderCombos, types: ["default"]});
      }
    }
  }

  // sometimes a combo has two types at the same time "preOrder", "withNonDiscountSale"
  let commonOfPreOrderAndNonDiscountCombosObj = {};

  for (let [key, values] of Object.entries(nonDiscountSaleCartCombosObj)) {
    let commonCombo = null;
    
    for (let nonDiscountCombo of values) {
      commonCombo = preOrderCartCombos?.find(combo => combo.id === nonDiscountCombo.id);
      
      if (commonCombo) {
        // deleting this common combo of preOrder and nonDiscount ones from nonDiscountSaleCartCombosObj
        // using this to prevent "unsafe" variable reference warning message
        const commonComboForFn = commonCombo;

        // using nonDiscountSaleCartCombosObj[key] instead of values because
        // nonDiscountSaleCartCombosObj[key] contains current value
        nonDiscountSaleCartCombosObj[key] = 
          nonDiscountSaleCartCombosObj[key].filter(combo => combo.id !== commonComboForFn.id);

        if (!commonOfPreOrderAndNonDiscountCombosObj[key]) commonOfPreOrderAndNonDiscountCombosObj[key] = [];
        commonOfPreOrderAndNonDiscountCombosObj[key].push(commonCombo);
      }
    }
  }

  // deleting common combos of preOrder and nonDiscount ones from preOrderCartCombos
  for (let values of Object.values(commonOfPreOrderAndNonDiscountCombosObj)) {
    preOrderCartCombos = preOrderCartCombos.filter(combo => {
      const isCommonCombo = values.find(
        commonCombo => commonCombo.id === combo.id
      );

      return !isCommonCombo;
    });
  }

  // preOrder, withNonDiscountSale orders and ones that belongs to both types
  // are separate ones to make it easier to handle them properly
  if (preOrderCartCombos?.length) {
    for (let sellerId of uniqueCombinationSellerIds) {
      if (sellerId === undefined || sellerId === null) return;
      // adding a new combo if the possible result is not empty 
      const possibleResult = preOrderCartCombos?.filter(combo => cartCombosFilterFn(combo, sellerId, false));
      const defaultOrderCombos = _.chunk(possibleResult?.length ? possibleResult : [], 3);

      if (defaultOrderCombos?.length) {
        for (let orderCombos of defaultOrderCombos) {
          allOrderInfos.push({ combos: orderCombos, types: ["preOrder"] });
        }
      }
    }
  }

  for (let [key, values] of Object.entries(nonDiscountSaleCartCombosObj)) {
    if (values?.length) {
      for (let sellerId of uniqueCombinationSellerIds) {
        if (sellerId === undefined || sellerId === null) return;
        // adding a new combo if the possible result is not empty 
        const possibleResult = values?.filter(combo => cartCombosFilterFn(combo, sellerId, false));
        const nonDiscountOrderCombos = _.chunk(possibleResult?.length ? possibleResult : [], 3);

        if (nonDiscountOrderCombos?.length) {
          for (let orderCombos of nonDiscountOrderCombos) {
            allOrderInfos.push({ combos: orderCombos, types: ["withNonDiscountSale"] });
          }
        }
      }
    }
  }

  for (let [key, values] of Object.entries(commonOfPreOrderAndNonDiscountCombosObj)) {
    if (values?.length) {
      for (let sellerId of uniqueCombinationSellerIds) {
        if (sellerId === undefined || sellerId === null) return;
        // adding a new combo if the possible result is not empty 
        const possibleResult = values?.filter(combo => cartCombosFilterFn(combo, sellerId, false));
        const commonOfPreOrderAndNonDiscountOrderCombos = _.chunk(possibleResult?.length ? possibleResult : [], 3);

        if (commonOfPreOrderAndNonDiscountOrderCombos?.length) {
          for (let orderCombos of commonOfPreOrderAndNonDiscountOrderCombos) {
            allOrderInfos.push({ combos: orderCombos, types: ["preOrder", "withNonDiscountSale"] });
          }
        }
      }
    }
  }

  for (let orderInfo of allOrderInfos) {
    const id = orders.length + 1;
    // both authorized and unauthorized users can checkout their order
    const isAuth = faker.datatype.boolean(0.5);
    let user;
    if (isAuth) {
      user = USERS.length ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })] : USERS[0];
    }
    const receivent = receivents[faker.number.int({ min: 0, max: receivents.length - 1 })];

    const delivery = deliveries[faker.number.int({ min: 0, max: deliveries.length - 1 })];
    const deliveryType = deliveryTypes[delivery["delivery-typeId"] - 1];
    const deliveryPrice = delivery.price || deliveryType.price;

    const orderCourierDelivery = deliveryType.name === "courier"
      ? createOrderCourierDelivery(orderCourierDeliveries, courierSchedules, id)
      : null;
    
    const { additionalInfo } = createOrderDeviceCombinations(
      orderDeviceCombinations, orderInfo.combos, id, devices, deviceCombinations, saleDevices, sales, saleTypes
    );
    // const orderName = createOrderName(id, additionalInfo.names);
    let orderName = Math.random().toString().slice(2, 12);
    orderName = `${orderName.slice(0, 3)} ${orderName.slice(3, 6)} ${orderName.slice(6)}`

    const status = POSSIBLE_ORDER_STATUSES[faker.number.int({ min: 0, max: POSSIBLE_ORDER_STATUSES.length - 1 })];
    
    let name = null;
    let surname = null
    let email = null;
    let phoneNumber = null;
    
    if (user) {
      name = user.name;
      surname = user.surname;
      email = user.email;
      phoneNumber = user.phoneNumber; 
    } else {
      name = faker.person.firstName();
      surname = faker.person.lastName();
      email = faker.internet.email();
      const numberObj = parsePhoneNumber("+380 " + faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{4}/));
      const internationalNumber = numberObj.formatInternational(); 
      phoneNumber = internationalNumber;
    }
    
    // const info = faker.lorem.word({ length: { min: 8, max: 14 } });
    let info = Math.random().toString().slice(2, 12);
    info = `${info.slice(0, 3)} ${info.slice(3, 6)} ${info.slice(6)}`
    let storePickupPointId = null

    if (deliveryType.name === "self-delivery") {
      storePickupPointId = storePickupPoints[faker.number.int({ min: 0, max: storePickupPoints.length - 1 })].id;
    }

    // we should contain sale devices atm of creating an order to correctly handle
    // sales of order device combinations
    let orderSaleDevices = [];
    for (let cartCombo of orderInfo.combos) {
      const device = devices.find(dev => dev.id === cartCombo.deviceId);
      const devSaleDevices = saleDevices.filter(saleDev => saleDev.deviceId === device.id);

      orderSaleDevices = orderSaleDevices.concat(devSaleDevices);
    }

    const order = {
      "id": id,
      "orderTypes": orderInfo.types,
      "userId": user ? user.id : null,
      "name": name,
      "surname": surname,
      "email": email,
      "phoneNumber": phoneNumber,
      "devicePrice": additionalInfo.sum,
      "additionalServicesPrice": "0.00",
      "deliveryPrice": (+deliveryPrice).toFixed(2),
      "totalPrice": (+additionalInfo.sum + +deliveryPrice).toFixed(2),
      "totalDeviceAmount": additionalInfo.amount,
      "status": status,
      "orderName": orderName,
      "date": faker.date.recent(),
      "info": info,
      "receiventId": receivent.id,
      "store-pickup-pointId": storePickupPointId,
      "order-courier-deliveryId": orderCourierDelivery?.id || null,
      "sale-devices": orderSaleDevices
    }

    orders.push(order);
  }

  return {
    orders,
    orderCourierDeliveries,
    orderDeviceCombinations,
    receivents,
  };
}