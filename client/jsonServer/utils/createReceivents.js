const { faker } = require("@faker-js/faker");
const { USERS } = require("./consts");
const { parsePhoneNumber } = require("libphonenumber-js");

module.exports = () => {
  let receivents = [];

  for (let i = 0; i < 20; i++) {
    let phoneNumber;

    const numberObj = parsePhoneNumber("+380 " + faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{4}/));
    const internationalNumber = numberObj.formatInternational(); 
    phoneNumber = internationalNumber;

    const userId = USERS.length > 1 ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })]._id : USERS[0]._id;
    const receivent = {
      "id": receivents.length + 1,
      "userId": userId,
      "name": faker.person.firstName(),
      "surname": faker.person.lastName(),
      "patronymic": faker.person.middleName(),
      "email": faker.internet.email(),
      "phoneNumber": phoneNumber,
    }

    receivents.push(receivent);
  }

  return receivents;
}