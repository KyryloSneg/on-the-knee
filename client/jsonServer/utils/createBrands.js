const { faker } = require("@faker-js/faker");

module.exports = (devices) => {
  let brandValues = [];
  let brands = [];

  for (let i = 1; i <= devices.length; i++) {
    const dev = devices[i - 1];
    if (brandValues.includes(dev.brand)) continue;

    const brand = {
      "id": i,
      "createdAt": faker.date.recent(),
      "name": dev.brand
    } 

    brandValues.push(dev.brand);
    brands.push(brand);
  }

  return {
    brandValues,
    brands,
  };
}