const axios = require('axios').default;

async function getAllDevices() {
  const { data } = await axios.get("https://dummyjson.com/products?limit=100");
  return data.products;
}

async function getAllCategorySlugs() {
  let { data } = await axios.get("https://dummyjson.com/products/categories");
  data = data.map(obj => obj.slug);
  return data;
}

module.exports = {
  getAllDevices,
  getAllCategorySlugs,
}