import { $mockApi } from "./index";

export async function getOrderProblemByUserAndOrderId(userId, orderId) {
  const { data } = await $mockApi.get(`/order-problems?userId=${userId}&orderId=${orderId}`);
  return data;
}

export async function createOrderProblem(formData) {
  const { data } = await $mockApi.post("/order-problems", formData);
  return data;
}