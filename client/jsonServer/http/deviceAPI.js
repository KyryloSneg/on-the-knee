const { default: axios } = require("axios");

async function getAllProducts() {
  const { data } = await axios.get("https://dummyjson.com/products?limit=100");
  return data;
}

async function getAllProductCategories() {
  const { data } = await axios.get("https://dummyjson.com/products/categories");
  return data;
}

module.exports = {
  getAllProducts: getAllProducts,
  getAllProductCategories: getAllProductCategories,
}