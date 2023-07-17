const { faker } = require('@faker-js/faker');
const { POSSIBLE_COLORS } = require("./consts");

module.exports = function createDeviceColor(colorsArray, colorsId, deviceId, images, thumbnail) {
  const colors = {
    "id": colorsId,
    "deviceId": deviceId,
    "items": POSSIBLE_COLORS[faker.number.int({min: 0, max: POSSIBLE_COLORS.length - 1})].map(item => {
      return {
        ...item,
        "images": images,
        "thumbnail": thumbnail,
      };
    }),
  }

  colorsArray.push(colors);

  return colors;
}