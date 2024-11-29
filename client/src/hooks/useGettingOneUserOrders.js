import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneUserOrders, getOrderDeviceCombosOfOneOrder } from "../http/OrderAPI";
import { getDevice } from "../http/DeviceApi";
import { Context } from "Context";

function useGettingOneUserOrders(userId, setOrders = null, isUserStore = false, isToFetch = true) {
  const { user, fetchRefStore } = useContext(Context);

  async function fetchingFunc() {
    const orders = await getOneUserOrders(userId);

    await Promise.all(orders.map(async order => {
      const orderDevCombos = await getOrderDeviceCombosOfOneOrder(order?.id);
      await Promise.all(orderDevCombos?.map(async orderCombo => {
        orderCombo["device-combination"].device = await getDevice(orderCombo["device-combination"].deviceId);
      }));

      order["order-device-combinations"] = orderDevCombos;
    }));

    if (setOrders) {
      setOrders(orders);
      fetchRefStore.setHasAlreadyFetchedUserOrders(true);
    } else if (isUserStore) {
      user.setOrders(orders);
      fetchRefStore.setHasAlreadyFetchedUserOrders(true);
    }
  }

  const [fetching, isLoading, error] = useFetching(fetchingFunc);

  useEffect(() => {
    if (userId && isToFetch) fetching();
  }, [userId, isToFetch, setOrders, fetching]);

  return [fetching, isLoading, error];
}

export default useGettingOneUserOrders;