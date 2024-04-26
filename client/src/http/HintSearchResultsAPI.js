const { $mockApi } = require(".");

export async function getHintSearchResults() {
  const { data } = await $mockApi.get("/hint-search-results");
  return data;
}

export async function addHintSearchResult(result) {
  const { data } = await $mockApi.post("/hint-search-results", result);
  return data;
}