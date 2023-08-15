const { faker } = require("@faker-js/faker");
const createAllCombinationStrings = require("./createAllCombinationStrings");
const { MIN_IMAGE_WIDTH, MAX_IMAGE_WIDTH, MIN_IMAGE_HEIGHT, MAX_IMAGE_HEIGHT } = require("./consts");
const createStock = require("./createStock");

module.exports = (deviceId, attributeValues, deviceCombinations, stocks) => {  
  let attrValues = [];
  let combinationString = [];

  const width = faker.number.int({ min: MIN_IMAGE_WIDTH, max: MAX_IMAGE_WIDTH });
  const height = faker.number.int({ min: MIN_IMAGE_HEIGHT, max: MAX_IMAGE_HEIGHT });
  const imageAmount = faker.number.int({ min: 1, max: 4 });

  if (Object.keys(attributeValues).length) {

    for (let [key, values] of Object.entries(attributeValues)) {
      let temp = [];
      for (let value of values) {
        temp.push(`${key}:${value}`);
      }

      attrValues.push(temp);
    }
    createAllCombinationStrings(attrValues, combinationString);
    
    const defaultComboId = faker.number.int({ min: 0, max: combinationString.length - 1 });
    for (let combo of combinationString) {
      const thumbnail = faker.image.url({ width, height });

      let images = [];
      for (let i = 0; i < imageAmount; i++) {
        images.push(faker.image.url({ width, height }));
      }

      const id = deviceCombinations.length + 1;

      const dollars = Number(faker.commerce.price({ min: 5, max: 4000 }).split(".")[0]);
      const cents = faker.number.int({ min: 0, max: 9 }) / 10;
      const price = (dollars + cents).toFixed(2);

      const stock = createStock(id, stocks);
      const deviceCombination = {
        "id": deviceCombinations.length + 1,
        "combinationString": combo,
        "deviceId": deviceId,
        "sku": faker.string.alphanumeric({ length: { min: 8, max: 15 } }),
        "deviceCode": faker.number.int({ min: 100000000, max: 999999999 }),
        "stockId": stock.id,
        // Number() doesn't work properly 'cause of the json format, so we must parse it on the frontend side
        "price": price,
        "thumbnail": thumbnail,
        "images": images,
        "default": combinationString.indexOf(combo) === defaultComboId,
      }
  
      deviceCombinations.push(deviceCombination);
    }
  } else {
    const thumbnail = faker.image.url({ width, height });

    let images = [];
    for (let i = 0; i < imageAmount; i++) {
      images.push(faker.image.url({ width, height }));
    }

    const id = deviceCombinations.length + 1;

    const stock = createStock(id, stocks);
    const deviceCombination = {
      "id": id,
      "combinationString": null,
      "deviceId": deviceId,
      "sku": faker.string.alphanumeric({ length: { min: 8, max: 15 } }),
      "deviceCode": faker.number.int({ min: 100000000, max: 999999999 }),
      "stockId": stock.id,
      "price": faker.commerce.price(),
      "thumbnail": thumbnail,
      "images": images,
      "default": true,
    }

    deviceCombinations.push(deviceCombination);
  }

}