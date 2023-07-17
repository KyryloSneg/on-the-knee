const { faker } = require('@faker-js/faker');
const { POSSIBLE_COLORS } = require("./consts");

module.exports = function createDeviceColor(colorsArray, colorsId, deviceId, images) {
  const colors = {
    "id": colorsId,
    "deviceId": deviceId,
    "items": POSSIBLE_COLORS[faker.number.int({min: 0, max: POSSIBLE_COLORS.length - 1})].map(item => {
      return {
        ...item,
        "images": images, // images for the device page
      };
    }),
  }

  colorsArray.push(colors);

  return colors;
}