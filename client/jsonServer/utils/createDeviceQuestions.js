const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT, MOCK_USER, REAL_USER } = require("./consts");

module.exports = (questions, answers, deviceId) => {
  for (let i = 0; i < 5; i++) {
    const hasImages = i % 2 === 0;
    let images = [];

    if (hasImages) {
      const width = faker.number.int({ min: MIN_FEEDBACK_IMAGE_WIDTH, max: MAX_FEEDBACK_IMAGE_WIDTH })
      const height = faker.number.int({ min: MIN_FEEDBACK_IMAGE_HEIGHT, max: MAX_FEEDBACK_IMAGE_HEIGHT })
  
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        images.push(faker.image.url({ width, height }));
      }
    }

    let userId = null;
    const isAnonymously = faker.datatype.boolean(0.6);

    if (!isAnonymously) {
      const isRealUser = faker.datatype.boolean(0.4);
      userId = isRealUser ? REAL_USER._id : MOCK_USER._id;
    }

    const question = {
      "id": questions.length + 1,
      "deviceId": deviceId,
      "userId": userId,
      "isAnonymously": isAnonymously,
      "images": images,
      "message": faker.lorem.text(),
      "date": faker.date.recent(),
    }

    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      const isRealUser = faker.datatype.boolean(0.4);
      const userId = isRealUser ? REAL_USER._id : MOCK_USER._id;

      const answer = {
        "id": answers.length + 1,
        "device-questionId": question.id,
        "userId": userId,
        "message": faker.lorem.text(),
        "date": faker.date.recent(),
      }

      answers.push(answer);
    }

    questions.push(question);
  }

}