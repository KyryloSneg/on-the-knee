const { faker } = require("@faker-js/faker");
const { USERS } = require("./consts");
const createCartDevices = require("./createCartDevices");

module.exports = (devices) => {
  let carts = [];
  let cartDevices = [];

  for (let user of USERS) {
    const cart = {
      "id": faker.string.uuid(),
      "userId": user._id,
    };

    createCartDevices(cartDevices, cart.id, devices);
    carts.push(cart);
  } 

  return {
    carts,
    cartDevices,
  };
}