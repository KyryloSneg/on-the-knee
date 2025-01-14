const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT, MOCK_USER } = require("./consts");

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
      userId = MOCK_USER._id;
    }

    const question = {
      "id": faker.string.uuid(),
      "deviceId": deviceId,
      "userId": userId,
      "isAnonymously": isAnonymously,
      "images": images,
      "message": faker.lorem.text(),
      "date": faker.date.recent(),
      "isEdited": false,
    }

    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      const userId = MOCK_USER._id;

      const answer = {
        "id": faker.string.uuid(),
        "device-questionId": question.id,
        "userId": userId,
        "message": faker.lorem.text(),
        "date": faker.date.recent(),
        "isEdited": false,
      }

      answers.push(answer);
    }

    questions.push(question);
  }

}