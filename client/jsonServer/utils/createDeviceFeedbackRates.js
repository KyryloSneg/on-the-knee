const { faker } = require("@faker-js/faker");
const { MOCK_USER } = require("./consts");

module.exports = (feedbacks, deviceFeedbackLikes, deviceFeedbackLDislikes) => {
  for (let feedback of feedbacks) {
    for (let i = 0; i < faker.number.int(10); i++) {
      const isLike = faker.datatype.boolean(0.5);
      const userId = MOCK_USER._id;

      if (isLike) {
        const rate = {
          "id": deviceFeedbackLikes.length + 1,
          "device-feedbackId": feedback.id,
          "userId": userId
        };

        deviceFeedbackLikes.push(rate);
      } else {
        const rate = {
          "id": deviceFeedbackLDislikes.length + 1,
          "device-feedbackId": feedback.id,
          "userId": userId
        };

        deviceFeedbackLDislikes.push(rate);
      }
    }
  }
}