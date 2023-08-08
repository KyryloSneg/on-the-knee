const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT } = require("./consts");
const findAverageNum = require("../../src/utils/findAverageNum");

module.exports = (feedbacks, feedbackReplies, deviceId) => {
  let rates = [];

  for (let i = 0; i < 5; i++) {
    const hasImages = i % 2;
    let images = [];

    if (hasImages) {
      const width = faker.number.int({ min: MIN_FEEDBACK_IMAGE_WIDTH, max: MAX_FEEDBACK_IMAGE_WIDTH })
      const height = faker.number.int({ min: MIN_FEEDBACK_IMAGE_HEIGHT, max: MAX_FEEDBACK_IMAGE_HEIGHT })
  
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        images.push(faker.image.url({ width, height }));
      }
    }

    const rate = faker.number.float({ min: 1, max: 5, precision: 0.1 });
    rates.push(rate);

    const feedback = {
      "id": feedbacks.length + 1,
      "deviceId": deviceId,
      "userId": null, // TODO: add some userIds after creating users in the real server
      "images": images,
      "message": faker.lorem.text(),
      "rate": rate,
      "date": faker.date.recent(),
    }

    for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
      const width = faker.number.int({ min: MIN_FEEDBACK_IMAGE_WIDTH, max: MAX_FEEDBACK_IMAGE_WIDTH });
      const height = faker.number.int({ min: MIN_FEEDBACK_IMAGE_HEIGHT, max: MAX_FEEDBACK_IMAGE_HEIGHT });

      const reply = {
        "id": feedbackReplies.length + 1,
        "userId": null, // TODO: add some userIds after creating users in the real server
        "device-feedbackId": feedback.id,
        "images": [faker.image.url({ width, height })],
        "message": faker.lorem.text(),
        "date": faker.date.recent(),
      }

      feedbackReplies.push(reply);
    }

    feedbacks.push(feedback);

    const avgRating = findAverageNum(rates);
    return avgRating;
  }

}