const { faker } = require("@faker-js/faker");
const createReceivents = require("./createReceivents");
const { USERS, POSSIBLE_ORDER_STATUSES } = require("./consts");
const createOrderDeviceCombinations = require("./createOrderDeviceCombinations");
const createOrderName = require("./createOrderName");

module.exports = (devices, deviceCombinations, deliveries, deliveryTypes, cities, streets, storePickupPoints, courierSchedules) => {
  let orders = [];
  let orderDeviceCombinations = [];
  const receivents = createReceivents();

  for (let i = 0; i < 30; i++) {
    const id = orders.length + 1;
    // both authorized and unauthorized users can checkout their order
    // const user = null;
    const user = faker.datatype.boolean(0.5) && USERS.length ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })] : null;
    const receivent = receivents[faker.number.int({ min: 0, max: receivents.length - 1 })];

    const delivery = deliveries[faker.number.int({ min: 0, max: deliveries.length - 1 })];
    const deliveryType = deliveryTypes[delivery["delivery-typeId"] - 1];
    const deliveryPrice = delivery.price || deliveryType.price;
    
    const { additionalInfo } = createOrderDeviceCombinations(orderDeviceCombinations, id, devices, deviceCombinations);
    const orderName = createOrderName(id, additionalInfo.names);
    const status = POSSIBLE_ORDER_STATUSES[faker.number.int({ min: 0, max: POSSIBLE_ORDER_STATUSES.length - 1 })];
    
    let name = null;
    let surname = null
    let email = null;
    let phoneNumber = null;
    
    if (user) {
      // TODO: if authorized user checkouted an order we must assign the user data to the next vars: name, surname, email and phoneNumber 
    }
    
    const info = faker.lorem.word({ length: { min: 8, max: 14 } });
    let storePickupPointId = null

    let cityId = null;
    let streetId = null;
    let houseNumber = null;
    let floor = null;
    let toLiftOnTheFloor = null;
    let isHasElevator = null;
    let scheduleId = null;
    let scheduleShiftNumber = null;

    if (deliveryType.name === "courier") {
      cityId = cities[faker.number.int({ min: 0, max: cities.length - 1 })].id;
      streetId = streets[faker.number.int({ min: 0, max: streets.length - 1 })].id;
      floor = faker.number.int({ min: 0, max: 99 });
      toLiftOnTheFloor = faker.datatype.boolean(0.8);
      isHasElevator = faker.datatype.boolean(0.5);
      const schedule = courierSchedules[faker.number.int({ min: 0, max: courierSchedules.length - 1 })];
      scheduleId = schedule.id;
      scheduleShiftNumber = faker.number.int({ min: 1, max: Object.keys(schedule["shifts"]).length });
    } else if (deliveryType.name === "self-delivery") {
      storePickupPointId = storePickupPoints[faker.number.int({ min: 0, max: storePickupPoints.length - 1 })].id;
    }

    const order = {
      "id": id,
      "userId": user ? user.id : null,
      "name": name,
      "surname": surname,
      "email": email,
      "phoneNumber": phoneNumber,
      "devicesPrice": additionalInfo.sum,
      "deliveryPrice": deliveryPrice,
      "totalPrice": additionalInfo.sum + deliveryPrice,
      "totalDeviceAmount": additionalInfo.amount,
      "status": status,
      "orderName": orderName,
      "date": faker.date.recent(),
      "deliveryId": delivery.id,
      "info": info,
      "receiventId": receivent.id,
      "store-pickup-pointId": storePickupPointId,
      "cityId": cityId,
      "streetId": streetId,
      "houseNumber": houseNumber,
      "floor": floor,
      "toLiftOnTheFloor": toLiftOnTheFloor,
      "isHasElevetor": isHasElevator,
      "courier-scheduleId": scheduleId,
      "scheduleShiftNumber": scheduleShiftNumber,
    }

    orders.push(order);
  }

  return {
    orders,
    orderDeviceCombinations,
    receivents,
  };
}