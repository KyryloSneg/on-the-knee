const { $mockApi } = require(".");

export async function getSellers() {
  const { data } = await $mockApi.get("/sellers");
  return data;
}

export async function getOneSeller(id) {
  const { data } = await $mockApi.get("/sellers/" + id);
  return data;
}