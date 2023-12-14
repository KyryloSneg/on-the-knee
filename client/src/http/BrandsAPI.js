const { $mockApi } = require(".");

export async function getBrands() {
  const { data } = await $mockApi.get("/brands");
  return data;
}