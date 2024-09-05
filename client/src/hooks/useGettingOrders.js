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

    for (let sellerId of uniqueCombinationSellerIds) {
      if (!sellerId) return;
      // adding a new combo
      result[id] = user.cartDeviceCombinations?.filter(combo => {
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

              if (!!saleTypeName?.name && saleTypeName?.name !== "discount") {
                isWithNonDiscountSale = true;
                nonDiscountSaleName = saleTypeName?.name;

                nonDiscountSaleCartCombosObj[nonDiscountSaleName] = []; 
              }
            }
          }
        }

        if (isPreOrder) preOrderCartCombos.push(combo);
        if (isWithNonDiscountSale && nonDiscountSaleName) {
          nonDiscountSaleCartCombosObj[nonDiscountSaleName] = [
            ...nonDiscountSaleCartCombosObj[nonDiscountSaleName],
            combo
          ]; 
        }

        console.log(preOrderCartCombos);
        console.log(nonDiscountSaleCartCombosObj);
        return !isPreOrder && !isWithNonDiscountSale && combo?.device?.sellerId === sellerId;
      });
    
      id++;
    }

    if (preOrderCartCombos?.length) {
      result[id] = preOrderCartCombos;
      id++;
    }

    for (let values of Object.values(nonDiscountSaleCartCombosObj)) {
      if (values?.length) {
        result[id] = values;
        id++;
      }
    }

    return result;
  }, [user.cartDeviceCombinations, deviceStore.sales, deviceStore.saleTypeNames]);

  return orders;
}