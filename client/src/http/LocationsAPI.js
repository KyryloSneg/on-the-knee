import { $mockApi } from "./index";

export async function getLocations() {
  const { data } = await $mockApi.get("/cities");
  return data;
}

export async function getDistrict(id) {
  const { data } = await $mockApi.get("/districts/" + id);
  return data;
}

export async function getRegion(id) {
  const { data } = await $mockApi.get("/regions/" + id);
  return data;
}

export async function getCountry(id) {
  const { data } = await $mockApi.get("/countries/" + id);
  return data;
}