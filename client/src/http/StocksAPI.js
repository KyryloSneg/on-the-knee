import { $mockApi } from "./index";

export async function getStocks() {
  const { data } = await $mockApi.get("/stocks");
  return data;
}

export async function getOneStock(id) {
  const { data } = await $mockApi.get("/stocks/" + id);
  return data;
}