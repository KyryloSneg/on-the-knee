const { $mockApi } = require(".");

export async function getCategories() {
  const { data } = await $mockApi.get("/categories");
  return data;
}