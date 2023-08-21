const { faker } = require("@faker-js/faker");
const { USERS } = require("./consts");

module.exports = () => {
  let receivents = [];

  for (let i = 0; i < 20; i++) {
    const userId = USERS.length > 1 ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })]._id : USERS[0]._id;
    const receivent = {
      "id": receivents.length + 1,
      "userId": userId,
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