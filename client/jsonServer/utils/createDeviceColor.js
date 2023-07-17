const { faker } = require('@faker-js/faker');
const { POSSIBLE_COLORS } = require("./consts");

module.exports = function createDeviceColor(colorsArray, colorsId, deviceId) {
  const colors = {
    "id": colorsId,
    "deviceId": deviceId,
    "items": POSSIBLE_COLORS[faker.number.int({min: 0, max: POSSIBLE_COLORS.length - 1})],
  }

  colorsArray.push(colors);

  return colors;
}