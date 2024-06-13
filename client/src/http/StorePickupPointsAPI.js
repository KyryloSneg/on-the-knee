import { $mockApi } from "./index";

export async function getStorePickupPoints() {
  const { data } = await $mockApi.get("/store-pickup-points");
  return data;
}