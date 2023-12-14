const { $mockApi } = require(".");

export async function getSellers() {
  const { data } = await $mockApi.get("/sellers");
  return data;
}