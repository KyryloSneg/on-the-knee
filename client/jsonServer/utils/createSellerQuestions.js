const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");

module.exports = (sellerQuestions, sellerId) => {
  const userId = MOCK_USER._id;

  const question = {
    "id": faker.string.uuid(),
    "sellerId": sellerId,
    "userId": userId,
    "message": faker.lorem.text(),
    "date": faker.date.recent(),
  }

  sellerQuestions.push(question);
}