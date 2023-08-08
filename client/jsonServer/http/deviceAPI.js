const axios = require('axios').default;

async function getAllDevices() {
  const { data } = await axios.get("https://dummyjson.com/products?limit=100");
  return data.products;
}

async function getAllCategories() {
  const { data } = await axios.get("https://dummyjson.com/products/categories");
  return data;
}

module.exports = {
  getAllDevices,
  getAllCategories,
}