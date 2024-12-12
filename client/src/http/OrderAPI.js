import { getOneStorePickupPoint } from "./StorePickupPointsAPI";

const { $mockApi } = require(".");

export async function createOrder(order) {
  const { data } = await $mockApi.post("/orders", order);
  return data;
}

export async function createReceivent(receivent) {
  const { data } = await $mockApi.post("/receivents", receivent);
  return data;
}

export async function createOrderCourierDelivery(orderCourierDelivery) {
  const { data } = await $mockApi.post("/order-courier-deliveries", orderCourierDelivery);
  return data;
}

export async function createOrderDeviceCombination(orderDeviceCombination) {
  const { data } = await $mockApi.post("/order-device-combinations", orderDeviceCombination);
  return data;
}

export async function createOrderSelectedAdditionalServices(orderSelectedAdditionalServicesResult) {
  const { data } = await $mockApi.post("/order-selected-additional-services", orderSelectedAdditionalServicesResult);
  return data;
}

// fetchStringQueryParams starts with an ampersand "&"
export async function getOneUserOrders(userId, fetchStringQueryParams = "") {
  let { data } = await $mockApi.get(
    `/orders?_expand=receivent&_embed=order-device-combinations&_embed=order-selected-additional-services&userId=${userId}${fetchStringQueryParams}`
  );

  // json-server unfortunately can't fix the bug that make _expand param break
  // if the id value is null, so handle it by ourselves
  if (Array.isArray(data)) {
    for (let order of data) {
      const storePickupPointId = order["store-pickup-pointId"];
      const orderCourierDeliveryId = order["order-courier-deliveryId"];

      if (storePickupPointId !== null && storePickupPointId !== undefined) {
        order["store-pickup-point"] = await getOneStorePickupPoint(storePickupPointId);
      };

      if (orderCourierDeliveryId !== null && orderCourierDeliveryId !== undefined) {
        order["order-courier-delivery"] = await getOneOrderCourierDelivery(orderCourierDeliveryId)
      };

      if (order["order-selected-additional-services"]?.length) {
        // creating from array an object with additional services
        order["order-selected-additional-services"] = order["order-selected-additional-services"][0]
      }
    }
  }

  return data;
}

export async function getOrderDeviceCombosOfOneOrder(orderId) {
  let { data } = await $mockApi.get(`/order-device-combinations?orderId=${orderId}`);
  return data;
}

export async function getOneOrderCourierDelivery(id) {
  const { data } = await $mockApi.get("/order-courier-deliveries/" + id);
  return data;
}