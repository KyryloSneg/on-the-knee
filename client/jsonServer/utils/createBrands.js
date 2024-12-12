const { faker } = require("@faker-js/faker");
const { LOGO_WIDTH, LOGO_HEIGHT } = require("./consts");
const StringActions = require("./StringActions");

module.exports = (brandNames) => {
  let brands = [];

  for (let name of brandNames) {
    const brand = {
      "id": faker.string.uuid(),
      "name": name,
      "slug": StringActions.nameToSlug(name),
      "logo": faker.image.url({ width: LOGO_WIDTH, height: LOGO_HEIGHT }),
    };

    brands.push(brand);
  }

  return brands;
}