const { faker } = require("@faker-js/faker")

module.exports = (cartDevices, cartId, devices) => {

  for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
    const cartDevice = {
      "id": cartDevices.length + 1,
      "cartId": cartId,
      "deviceId": faker.number.int({ min: 0, max: devices.length - 1 }),
      "amount": faker.number.int({ min: 1, max: 10 }),
      "isAdditional": faker.datatype.boolean(0.2),
    }

    cartDevices.push(cartDevice);
  }
  
}