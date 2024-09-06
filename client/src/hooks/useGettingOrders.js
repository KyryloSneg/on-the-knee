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

              nonDiscountSaleCartCombosObj[nonDiscountSaleName] = [];
            }
          }
        }
      }

      if (isDefault) {
        const isAlreadyEncounteredPreOrderCombo = !!preOrderCartCombos.find(existingCombo => existingCombo.id === combo.id);
        if (isPreOrder && !isAlreadyEncounteredPreOrderCombo) preOrderCartCombos.push(combo);
        
        const isAlreadyEncounteredNonDiscountSaleCombo = !!Object.values(!!nonDiscountSaleCartCombosObj)?.find(
          existingCombo => existingCombo.id === combo.id
        );
        if (
          isWithNonDiscountSale && nonDiscountSaleName 
          && !isAlreadyEncounteredNonDiscountSaleCombo
        ) {
          nonDiscountSaleCartCombosObj[nonDiscountSaleName] = [
            ...nonDiscountSaleCartCombosObj[nonDiscountSaleName],
            combo
          ]; 
        }
      }

      let passingComboCondition = !isPreOrder && !isWithNonDiscountSale && combo?.device?.sellerId === sellerId;
      if (!isDefault) {
        passingComboCondition = combo?.device?.sellerId === sellerId;
      }

      return passingComboCondition;
    }

    for (let sellerId of uniqueCombinationSellerIds) {
      if (!sellerId) return;
      // adding a new combo if the possible result is not empty 
      const possibleResult = user.cartDeviceCombinations?.filter(combo => cartCombosFilterFn(combo, sellerId));
    
      if (possibleResult?.length) {
        result[id] = { value: possibleResult, type: "default", isFreeDelivery: false };
        id++;
      }
    }

    // preOrder and withNonDiscountSale orders are separate ones to make it easier to handle them properly
    if (preOrderCartCombos?.length) {
      for (let sellerId of uniqueCombinationSellerIds) {
        if (!sellerId) return;
        // adding a new combo if the possible result is not empty 
        const possibleResult = preOrderCartCombos?.filter(combo => cartCombosFilterFn(combo, sellerId, false));
      
        if (possibleResult?.length) {
          result[id] = { value: possibleResult, type: "preOrder", isFreeDelivery: false };
          id++;
        }
      }
    }

    for (let [key, values] of Object.entries(nonDiscountSaleCartCombosObj)) {
      if (values?.length) {
        const isFreeDelivery = key === "freeDelivery";

        for (let sellerId of uniqueCombinationSellerIds) {
          if (!sellerId) return;
          // adding a new combo if the possible result is not empty 
          const possibleResult = values?.filter(combo => cartCombosFilterFn(combo, sellerId, false));
        
          if (possibleResult?.length) {
            result[id] = { value: possibleResult, type: "withNonDiscountSale", isFreeDelivery };
            id++;
          }
        }
      }
    }

    return result;
  }, [user.cartDeviceCombinations, deviceStore.sales, deviceStore.saleTypeNames]);

  return orders;
}