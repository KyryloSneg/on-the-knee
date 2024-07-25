import { ONE_CART_API_URL, ONE_CART_DEVICE_COMBINATIONS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getOneCart(userId) {
  const { data } = await $mockApi.get(ONE_CART_API_URL.replace("USER_ID_TO_REPLACE", userId));
  return data?.length ? data[0] : data;
}

export async function getOneCartDeviceCombinations(cartId) {
  const { data } = await $mockApi.get(ONE_CART_DEVICE_COMBINATIONS_API_URL.replace("CART_ID_TO_REPLACE", cartId));
  return data;
}

export async function createCartDeviceCombination(combo) {
  const { data } = await $mockApi.post("/cart-device-combinations", combo);
  return data;
}

export async function deleteCartDeviceCombination(id) {
  await $mockApi.delete("/cart-device-combinations/" + id);
}

export async function patchCartDeviceCombination(id, contentToReplaceWith) {
  await $mockApi.patch("/cart-device-combinations/" + id, contentToReplaceWith);
}