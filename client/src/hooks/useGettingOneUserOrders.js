import { useEffect } from "react";
import useFetching from "./useFetching";
import { getOneUserOrders, getOrderDeviceCombosOfOneOrder } from "../http/OrderAPI";
import { getDevice } from "../http/DeviceApi";

function useGettingOneUserOrders(userId, setOrders) {
  async function fetchingFunc() {
    const orders = await getOneUserOrders(userId);

    await Promise.all(orders.map(async order => {
      const orderDevCombos = await getOrderDeviceCombosOfOneOrder(order?.id);
      await Promise.all(orderDevCombos?.map(async orderCombo => {
        orderCombo["device-combination"].device = await getDevice(orderCombo["device-combination"].deviceId);
      }));

      order["order-device-combinations"] = orderDevCombos;
    }));

    setOrders(orders);
  }

  const [fetching, isLoading] = useFetching(fetchingFunc);

  useEffect(() => {
    if (userId) fetching();
  }, [userId, setOrders, fetching]);

  return isLoading;
}

export default useGettingOneUserOrders;