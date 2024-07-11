const { faker } = require("@faker-js/faker");
const { REAL_USER, MOCK_USER } = require("./consts");

module.exports = (sellerQuestions, sellerId) => {
  const isRealUser = faker.datatype.boolean(0.4);
  const userId = isRealUser ? REAL_USER._id : MOCK_USER._id;

  const question = {
    "id": sellerQuestions.length + 1,
    "sellerId": sellerId,
    "userId": userId,
    "message": faker.lorem.text(),
    "date": faker.date.recent(),
  }

  sellerQuestions.push(question);
}