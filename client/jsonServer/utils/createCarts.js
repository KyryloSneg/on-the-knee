const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");
const createCartDeviceCombos = require("./createCartDeviceCombos");

module.exports = (deviceCombos) => {
  let carts = [];
  let cartDeviceCombos = [];

  // USERS
  for (let user of [MOCK_USER]) {
    const cart = {
      "id": faker.string.uuid(),
      "userId": user._id,
    };

    // createCartDeviceCombos(cartDeviceCombos, cart.id, deviceCombos);
    carts.push(cart);
  } 

  return {
    carts,
    cartDeviceCombos,
  };
}