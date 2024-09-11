import DeviceSalesActions from "../utils/DeviceSalesActions";

const { useMemo, useContext } = require("react");
const { Context } = require("../Context");
const { FIRST_CHECKOUT_ORDER_ID } = require("../utils/consts");

export default function useGettingOrders() {
  const { user, deviceStore } = useContext(Context);

  const orders = useMemo(() => {
    const combinationSellerIds = user.cartDeviceCombinations?.map(combo => combo?.device?.sellerId) || [];
    const uniqueCombinationSellerIds = Array.from(new Set(combinationSellerIds));

    let id = FIRST_CHECKOUT_ORDER_ID;
    let result = {};

    // preorder cart combos and ones with non-discount sales
    let preOrderCartCombos = [];
    let nonDiscountSaleCartCombosObj = {};

    // filter fn to separate cart combos of different sellers
    function cartCombosFilterFn(combo, sellerId, isDefault = true) {
      const isPreOrder = combo?.device?.isPreOrder;
      let isWithNonDiscountSale = false;
      let nonDiscountSaleName;

      if (combo?.device?.["sale-devices"]) {
        const { deviceSaleTypes } = DeviceSalesActions.getSaleTypesAndDiscount(
          combo?.device, deviceStore.sales, deviceStore.saleTypeNames
        );

        if (deviceSaleTypes) {
          for (let saleType of deviceSaleTypes) {
            const saleTypeName = deviceStore.saleTypeNames?.find(
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

      let passingComboCondition = !isPreOrder && !isWithNonDiscountSale && combo?.device?.sellerId === sellerId;
      if (!isDefault) {
        passingComboCondition = combo?.device?.sellerId === sellerId;
      }

      return passingComboCondition;
    }

    for (let sellerId of uniqueCombinationSellerIds) {
      if (sellerId === undefined || sellerId === null) return;
      // adding a new combo if the possible result is not empty 
      const possibleResult = user.cartDeviceCombinations?.filter(combo => cartCombosFilterFn(combo, sellerId));

      if (possibleResult?.length) {
        result[id] = { value: possibleResult, types: ["default"], isFreeDelivery: false };
        id++;
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

        if (possibleResult?.length) {
          result[id] = { value: possibleResult, types: ["preOrder"], isFreeDelivery: false };
          id++;
        }
      }
    }

    for (let [key, values] of Object.entries(nonDiscountSaleCartCombosObj)) {
      if (values?.length) {
        const isFreeDelivery = key === "freeDelivery";

        for (let sellerId of uniqueCombinationSellerIds) {
          if (sellerId === undefined || sellerId === null) return;
          // adding a new combo if the possible result is not empty 
          const possibleResult = values?.filter(combo => cartCombosFilterFn(combo, sellerId, false));

          if (possibleResult?.length) {
            result[id] = { value: possibleResult, types: ["withNonDiscountSale"], isFreeDelivery };
            id++;
          }
        }
      }
    }

    for (let [key, values] of Object.entries(commonOfPreOrderAndNonDiscountCombosObj)) {
      if (values?.length) {
        const isFreeDelivery = key === "freeDelivery";

        for (let sellerId of uniqueCombinationSellerIds) {
          if (sellerId === undefined || sellerId === null) return;
          // adding a new combo if the possible result is not empty 
          const possibleResult = values?.filter(combo => cartCombosFilterFn(combo, sellerId, false));

          if (possibleResult?.length) {
            result[id] = { value: possibleResult, types: ["preOrder", "withNonDiscountSale"], isFreeDelivery };
            id++;
          }
        }
      }
    }

    return result;
  }, [user.cartDeviceCombinations, deviceStore.sales, deviceStore.saleTypeNames]);

  return orders;
}