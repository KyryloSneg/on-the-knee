const { faker } = require("@faker-js/faker");
const createCartDeviceCombos = require("./createCartDeviceCombos");

module.exports = (deviceCombos) => {
  let carts = [];
  let cartDeviceCombos = [];
  let cartSelectedAdditionalServicesArr = [];

  // USERS
  // [REAL_USER]
  for (let user of []) {
    const cart = {
      "id": faker.string.uuid(),
      "userId": user._id,
    };

    const cartSelectedAdditionalServices = {
      "id": faker.string.uuid(),
      "cartId": cart.id,
      "selected-additional-services": {},
    }
    
    // createCartDeviceCombos(cartDeviceCombos, cart.id, deviceCombos);
    carts.push(cart);
    cartSelectedAdditionalServicesArr.push(cartSelectedAdditionalServices);
  }
  
  for (let i = 0; i < faker.number.int({ min: 5, max: 10 }); i++) {
    createCartDeviceCombos(cartDeviceCombos, faker.string.uuid(), deviceCombos);
  }

  return {
    carts,
    cartDeviceCombos,
    cartSelectedAdditionalServices: cartSelectedAdditionalServicesArr
  };
}