const { faker } = require('@faker-js/faker');
const { POSSIBLE_COLORS } = require("./consts");
const createDeviceCode = require('./createDeviceCode');
const createMpn = require('./createMpn');

module.exports = function createDeviceColor(colorsArray, colorsId, deviceId, images, baseMpn) {
  const colors = {
    "id": colorsId,
    "deviceId": deviceId,
    "items": POSSIBLE_COLORS[faker.number.int({min: 0, max: POSSIBLE_COLORS.length - 1})].map(item => {
      return {
        ...item,
        "images": images, // images for the device page
        "device-code": createDeviceCode(),
        "mpn": createMpn(baseMpn),
      };
    }),
  }

  colorsArray.push(colors);

  return colors;
}