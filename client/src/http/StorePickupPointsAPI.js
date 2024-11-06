import { $mockApi } from "./index";

export async function getStorePickupPoints() {
  const { data } = await $mockApi.get("/store-pickup-points");
  return data;
}

export async function getOneStorePickupPoint(id) {
  const { data } = await $mockApi.get("/store-pickup-points/" + id);
  return data;
}