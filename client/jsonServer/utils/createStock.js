const { faker } = require("@faker-js/faker");

module.exports = (deviceCombinationId, stocks) => {
  const isZero = faker.datatype.boolean(0.2);
  const totalStock = isZero ? faker.number.int({ min: 1, max: 100 }) : 0;

  let stockStatus;
  if (totalStock === 0) {
    stockStatus = "Out of stock";
  } else if (totalStock <= 15) {
    stockStatus = "Is running out";
  } else {
    stockStatus = "In stock";
  }

  const stock = {
    "id": stocks.length + 1,
    "stockStatus": stockStatus,
    "totalStock": totalStock,
    "device-combinationId": deviceCombinationId,
  };
  stocks.push(stock);

  return stock;
}