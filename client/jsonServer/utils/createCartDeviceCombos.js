const { faker } = require("@faker-js/faker")

module.exports = (cartDeviceCombos, cartId, deviceCombos) => {

  for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
    const deviceCombination = deviceCombos[faker.number.int({ min: 0, max: deviceCombos.length - 1 })];
    const cartDeviceCombo = {
      "id": faker.string.uuid(),
      "cartId": cartId,
      "deviceId": deviceCombination.deviceId,
      "device-combinationId": deviceCombination.id,
      "amount": faker.number.int({ min: 1, max: 10 }),
    }

    cartDeviceCombos.push(cartDeviceCombo);
  }
  
}