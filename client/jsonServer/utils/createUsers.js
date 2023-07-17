const { faker } = require('@faker-js/faker');

function createUsers() {
  let users = [];
  let carts = [];
  let favorites = [];
  let comparison = [];

  for (let i = 1; i <= 10; i++) {
    const user = {
      "id": i,
      "firstName": faker.person.firstName(),
      "lastName": faker.person.lastName(),
      "email": faker.internet.email(),
      "password": faker.internet.password(),
      "phoneNumber": faker.phone.number(),
      "role": "PUBLIC"
    }

    const cart = {
      "id": i,
      "userId": i,
    }

    const favoritesItem = {
      "id": i,
      "userId": i,
    }

    const comparisonDevice = {
      "id": i,
      "userId": i,
    }

    users.push(user);
    carts.push(cart);
    favorites.push(favoritesItem);
    comparison.push(comparisonDevice);
  }

  return {
    users,
    carts,
    favorites,
    comparison,
  };
}

module.exports = createUsers;