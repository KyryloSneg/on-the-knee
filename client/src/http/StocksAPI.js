import { $mockApi } from "./index";

export async function getStocks() {
  const { data } = await $mockApi.get("/stocks");
  return data;
}

export async function getOneStock(id) {
  const { data } = await $mockApi.get("/stocks/" + id);
  return data;
}

export async function patchStock(id, contentToReplaceWith) {
  const { data } = await $mockApi.patch("/stocks/" + id, contentToReplaceWith);
  return data;
}