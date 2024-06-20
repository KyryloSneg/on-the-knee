const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT, USERS } = require("./consts");

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

    const userId = USERS.length > 1 ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })]._id : USERS[0]._id;
    const question = {
      "id": questions.length + 1,
      "deviceId": deviceId,
      "userId": userId,
      "images": images,
      "message": faker.lorem.text(),
      "date": faker.date.recent(),
      "likes": faker.number.int(150),
      "dislikes": faker.number.int(150),
    }

    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      const width = faker.number.int({ min: MIN_FEEDBACK_IMAGE_WIDTH, max: MAX_FEEDBACK_IMAGE_WIDTH });
      const height = faker.number.int({ min: MIN_FEEDBACK_IMAGE_HEIGHT, max: MAX_FEEDBACK_IMAGE_HEIGHT })
      const userId = USERS.length > 1 ? USERS[faker.number.int({ min: 0, max: USERS.length - 1 })]._id : USERS[0]._id;

      const answer = {
        "id": answers.length + 1,
        "userId": userId,
        "device-questionId": question.id,
        "images": [faker.image.url({ width, height })],
        "message": faker.lorem.text(),
        "date": faker.date.recent(),
        "likes": faker.number.int(150),
        "dislikes": faker.number.int(150),
      }

      answers.push(answer);
    }

    questions.push(question);
  }

}