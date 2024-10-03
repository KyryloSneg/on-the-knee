const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");
const { parsePhoneNumber } = require("libphonenumber-js");

module.exports = () => {
  let receivents = [];

  for (let i = 0; i < 20; i++) {
    let phoneNumber;

    const numberObj = parsePhoneNumber("+380 " + faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{4}/));
    const internationalNumber = numberObj.formatInternational(); 
    phoneNumber = internationalNumber;

    let userId = null;
    const isAuthUser = faker.datatype.boolean(0.5);

    if (isAuthUser) {
      userId = MOCK_USER._id;
    }

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