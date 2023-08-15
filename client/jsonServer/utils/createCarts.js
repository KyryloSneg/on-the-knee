const { faker } = require("@faker-js/faker");
const { USER_IDS } = require("./consts");
const createCartDevices = require("./createCartDevices");

module.exports = (devices) => {
  let carts = [];
  let cartDevices = [];

  for (let id of USER_IDS) { // TODO: change USER_IDS to USERS in future
    const cart = {
      "id": faker.string.uuid(),
      "userId": id,
    };

    createCartDevices(cartDevices, cart.id, devices);
    carts.push(cart);
  } 

  return {
    carts,
    cartDevices,
  };
}