const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT, MOCK_USER } = require("./consts");
const findAverageNum = require("../../src/utils/findAverageNum");

module.exports = (feedbacks, feedbackReplies, deviceId) => {
  let rates = [];

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

    const rate = faker.number.int({ min: 1, max: 5 });
    rates.push(rate);

    let userId = null;
    const isAnonymously = faker.datatype.boolean(0.6);

    if (!isAnonymously) {
      userId = MOCK_USER._id;
    }

    const feedback = {
      "id": feedbacks.length + 1,
      "deviceId": deviceId,
      "userId": userId,
      "isAnonymously": isAnonymously,
      "images": images,
      "message": faker.lorem.text(),
      "advantages": faker.lorem.text(),
      "disadvantages": faker.lorem.text(),
      "rate": rate,
      "date": faker.date.recent(),
      "isEdited": false,
    }

    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      const userId = MOCK_USER._id;

      const reply = {
        "id": feedbackReplies.length + 1,
        "device-feedbackId": feedback.id,
        "userId": userId,
        "message": faker.lorem.text(),
        "date": faker.date.recent(),
        "isEdited": false,
      }

      feedbackReplies.push(reply);
    }

    feedbacks.push(feedback);
  }
  
  const avgRating = findAverageNum(rates);
  return avgRating;

}