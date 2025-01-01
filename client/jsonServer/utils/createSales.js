const { faker } = require("@faker-js/faker");
const { POSSIBLE_SALE_TYPE_NAMES, MIN_SALE_IMAGE_WIDTH, MAX_SALE_IMAGE_WIDTH, MAX_SALE_IMAGE_HEIGHT, MIN_SALE_IMAGE_HEIGHT, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT, MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } = require("./consts");
const createSaleTypes = require("./createSaleTypes");
const DateActions = require("./DateActions");
const StringActions = require("./StringActions");

module.exports = (sales, saleTypes, saleTypeNames) => {
  
  if (!saleTypeNames.length) {
    for (let { name } of POSSIBLE_SALE_TYPE_NAMES) {
      const width = faker.number.int({ min: MIN_IMAGE_WIDTH, max: MAX_IMAGE_WIDTH });
      const height = faker.number.int({ min: MIN_IMAGE_HEIGHT, max: MAX_IMAGE_HEIGHT });

      const typeName = {
        "id": faker.string.uuid(),
        "name": name,
        // do not ask why we use "name" instead of "slug", "nameToRender" instead of "name"
        // (i don't want to change it, because everything that uses type names can be broken and i won't know about this) 
        "nameToRender": StringActions.capitalize(StringActions.splitByUpperCaseLetters(name)),
        // we use this image on the sales page (in the bar with sale type selection)
        "image": faker.image.url({ width, height }),
      }
  
      saleTypeNames.push(typeName);
    }
  }
  
  for (let i = 0; i <= 10; i++) {
    const id = faker.string.uuid();
    const description = faker.lorem.sentence({ min: 5, max: 15 });

    const width = faker.number.int({ min: MIN_SALE_IMAGE_WIDTH, max: MAX_SALE_IMAGE_WIDTH });
    const height = faker.number.int({ min: MIN_SALE_IMAGE_HEIGHT, max: MAX_SALE_IMAGE_HEIGHT });

    const typeNames = createSaleTypes(id, saleTypes, saleTypeNames);
    const typeNameStr = typeNames.map(t => t.name).join("-");
    const slug = typeNameStr.toLowerCase();

    const expiresAfter = faker.number.int({ min: 3, max: 40 }); // a sale expires after 3-40 days
    const hours = DateActions.generateRandomHours();
    const expiresAt = DateActions.createExpiresAtDate(expiresAfter, hours);

    const sale = {
      "id": id,
      "name": faker.lorem.sentence(),
      "description": description,
      "thumbnail": faker.image.url({ width, height }),
      "alt": faker.lorem.sentence(),
      "slug": slug,
      "expiresAt": expiresAt,
      // idk what is this field for (because code comments are for stupid men)
      // "isMain": faker.datatype.boolean(0.4),
      "createdAt": new Date(),
      // on the real server we'd change this field to "true" when the createdAt date has come
      // (it hides the sale if it has ended)
      "hasEnded": false,
    }

    sales.push(sale);
  }
  
}