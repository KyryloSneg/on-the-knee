import { $mockApi } from "./index";

export async function getStocks() {
  const { data } = await $mockApi.get("/stocks");
  return data;
}