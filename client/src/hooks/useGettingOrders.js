const { useMemo, useContext } = require("react");
const { Context } = require("../Context");
const { FIRST_CHECKOUT_ORDER_ID } = require("../utils/consts");

export default function useGettingOrders() {
  const { user } = useContext(Context);

  const orders = useMemo(() => {
    const combinationSellerIds = user.cartDeviceCombinations?.map(combo => combo?.device?.sellerId) || [];
    const uniqueCombinationSellerIds = Array.from(new Set(combinationSellerIds));

    let id = FIRST_CHECKOUT_ORDER_ID;
    let result = {};

    for (let sellerId of uniqueCombinationSellerIds) {
      if (!sellerId) return;
      // adding a new combo
      result[id] = user.cartDeviceCombinations?.filter(combo => combo?.device?.sellerId === sellerId);
      id++;
    }

    return result;
  }, [user.cartDeviceCombinations]);

  return orders;
}