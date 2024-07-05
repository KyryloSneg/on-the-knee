const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");

module.exports = (questions, deviceQuestionLikes, deviceQuestionDislikes) => {
  for (let question of questions) {
    for (let i = 0; i < faker.number.int(10); i++) {
      const isLike = faker.datatype.boolean(0.5);
      const userId = MOCK_USER._id;

      if (isLike) {
        const rate = {
          "id": deviceQuestionLikes.length + 1,
          "device-questionId": question.id,
          "userId": userId
        };

        deviceQuestionLikes.push(rate);
      } else {
        const rate = {
          "id": deviceQuestionDislikes.length + 1,
          "device-questionId": question.id,
          "userId": userId
        };

        deviceQuestionDislikes.push(rate);
      }
    }
  }
}