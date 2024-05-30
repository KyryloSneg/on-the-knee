import { $mockApi } from "./index";

export async function getLocations() {
  const { data } = await $mockApi.get("/cities");
  return data;
}