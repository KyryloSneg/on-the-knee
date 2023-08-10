const { faker } = require("@faker-js/faker");
const { LOGO_WIDTH, LOGO_HEIGHT } = require("./consts");

module.exports = (saleId, saleTypes, saleTypeNames) => {

  const names = [];
  let leftNames = [...saleTypeNames];

  for (let i = 0; i <= faker.number.int({ min: 0, max: saleTypeNames.length - 1 }); i++) {
    const name = leftNames[faker.number.int({ min: 0, max: leftNames.length - 1 })];
    leftNames = leftNames.filter(n => n !== name);

    const saleType = {
      "id": saleTypes.length + 1,
      "saleId": saleId,
      "saleTypeNameId": name.id,
      "discountPercentage": name.name === "discount" ? faker.number.int({ min: 5, max: 80 }) : null,
      "logo": faker.image.url({ width: LOGO_WIDTH, height: LOGO_HEIGHT }),
    }

    names.push(name);
    saleTypes.push(saleType);
  }

  return names;
}