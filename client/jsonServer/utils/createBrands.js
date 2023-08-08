const { faker } = require("@faker-js/faker");
const { LOGO_WIDTH, LOGO_HEIGHT } = require("./consts");

module.exports = (brandNames) => {
  let brands = [];

  for (let name of brandNames) {
    const brand = {
      "id": brands.length + 1,
      "name": name,
      "logo": faker.image.url({ width: LOGO_WIDTH, height: LOGO_HEIGHT }),
    };

    brands.push(brand);
  }

  return brands;
}