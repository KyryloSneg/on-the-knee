const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");

module.exports = (sellerQuestions, sellerId) => {
  const userId = MOCK_USER._id;

  const question = {
    "id": sellerQuestions.length + 1,
    "sellerId": sellerId,
    "userId": userId,
    "message": faker.lorem.text(),
    "date": faker.date.recent(),
  }

  sellerQuestions.push(question);
}