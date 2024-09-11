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

export async function createOrderDeviceCombinations(orderDeviceCombinations) {
  const { data } = await $mockApi.post("/order-device-combinations", orderDeviceCombinations);
  return data;
}

export async function createOrderSelectedAdditionalServices(orderSelectedAdditionalServicesResult) {
  const { data } = await $mockApi.post("/order-selected-additional-services", orderSelectedAdditionalServicesResult);
  return data;
}