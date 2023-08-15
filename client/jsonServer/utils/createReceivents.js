const { faker } = require("@faker-js/faker");

module.exports = () => {
  let receivents = [];

  for (let i = 0; i < 20; i++) {
    const receivent = {
      "id": receivents.length + 1,
      "userId": null, // TODO: users later on
      "name": faker.person.firstName(),
      "surname": faker.person.lastName(),
      "patronymic": faker.person.middleName(),
      "email": faker.internet.email(),
      "phoneNumber": faker.phone.number(),
    }

    receivents.push(receivent);
  }

  return receivents;
}