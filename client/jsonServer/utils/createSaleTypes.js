const { faker } = require("@faker-js/faker");
const { POSSIBLE_SALE_TYPE_NAMES } = require("./consts");

module.exports = (saleId, saleTypes, saleTypeNames) => {

  const names = [];
  let leftNames = [...saleTypeNames];

  for (let i = 0; i <= faker.number.int({ min: 0, max: saleTypeNames.length - 1 }); i++) {
    const name = leftNames[faker.number.int({ min: 0, max: leftNames.length - 1 })];
    leftNames = leftNames.filter(n => n !== name);
    
    const discountPercentage = name.name === "discount" ? faker.number.int({ min: 5, max: 80 }) : null
    const typeNameObj = {...POSSIBLE_SALE_TYPE_NAMES.find(typeName => typeName.name === name.name)};
    delete typeNameObj["name"];

    let dataToRender = typeNameObj;
    if (name.name === "discount") {
      dataToRender["text"] = `${discountPercentage}%`;
    }

    const saleType = {
      "id": faker.string.uuid(),
      "saleId": saleId,
      "saleTypeNameId": name.id,
      "discountPercentage": discountPercentage,
      ...dataToRender,
    }

    names.push(name);
    saleTypes.push(saleType);
  }

  return names;
}