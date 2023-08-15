const { faker } = require("@faker-js/faker");
const { POSSIBLE_SALE_TYPE_NAMES, MIN_SALE_IMAGE_WIDTH, MAX_SALE_IMAGE_WIDTH, MAX_SALE_IMAGE_HEIGHT, MIN_SALE_IMAGE_HEIGHT } = require("./consts");
const createSaleTypes = require("./createSaleTypes");
const DateActions = require("./DateActions");

module.exports = (sales, saleTypes, saleTypeNames) => {
  
  if (!saleTypeNames.length) {
    for (let name of POSSIBLE_SALE_TYPE_NAMES) {
      const typeName = {
        "id": saleTypeNames.length + 1,
        "name": name,
      }
  
      saleTypeNames.push(typeName);
    }
    
  }
  
  for (let i = 0; i <= 10; i++) {
    const id = sales.length + 1;
    const description = faker.lorem.sentence({ min: 5, max: 15 });

    const width = faker.number.int({ min: MIN_SALE_IMAGE_WIDTH, max: MAX_SALE_IMAGE_WIDTH });
    const height = faker.number.int({ min: MIN_SALE_IMAGE_HEIGHT, max: MAX_SALE_IMAGE_HEIGHT });

    const typeNames = createSaleTypes(id, saleTypes, saleTypeNames);
    const typeNameStr = typeNames.map(t => t.name).join("-");
    const slug = `${id}-${typeNameStr}`.toLowerCase();

    const expiresAfter = faker.number.int({ min: 3, max: 40 }); // a sale expires after 3-40 days
    const hours = DateActions.generateRandomHours();
    const expiresAt = DateActions.createExpiresAtDate(expiresAfter, hours);

    const sale = {
      "id": id,
      "description": description,
      "thumbnail": faker.image.url({ width, height }),
      "slug": slug,
      "expiresAt": expiresAt, // we can't delete a sale from the mock server but we still have to include the field
      "isMain": faker.datatype.boolean(0.4),
      "createdAt": new Date(), // we use this field to override old sales with the new ones (if we have conflict of same types)
    }

    sales.push(sale);
  }
  
}