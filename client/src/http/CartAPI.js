import { v4 } from "uuid";
import { ONE_CART_API_URL, ONE_CART_DEVICE_COMBINATIONS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getOneCart(userId) {
  const { data } = await $mockApi.get(ONE_CART_API_URL.replace("USER_ID_TO_REPLACE", userId));
  return Array.isArray(data) ? data?.[0] : data;
}

export async function getOneCartDeviceCombinations(cartId) {
  const { data } = await $mockApi.get(ONE_CART_DEVICE_COMBINATIONS_API_URL.replace("CART_ID_TO_REPLACE", cartId));
  return data;
}

export async function getOneCartSelectedAdditionalServices(cartId) {
  const { data } = await $mockApi.get("/cart-selected-additional-services?cartId=" + cartId);
  return Array.isArray(data) ? data?.[0] : data;
}

export async function createCart(userId) {
  // the logic should be located on the server if we weren't using the mock one
  const cart = {
    "id": v4(),
    "userId": userId,
  };

  const cartSelectedAdditionalServices = {
    "id": v4(),
    "cartId": cart.id,
    "selected-additional-services": {},
  }

  const { data: cartData } = await $mockApi.post("/carts", cart);
  const { 
    data: cartSelectedAdditionalServicesData 
  } = await $mockApi.post("/cart-selected-additional-services", cartSelectedAdditionalServices);

  return { cartData, cartSelectedAdditionalServicesData };
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

export async function patchCartSelectedAdditionalServices(id, contentToReplaceWith) {
  await $mockApi.patch("/cart-selected-additional-services/" + id, contentToReplaceWith);
}