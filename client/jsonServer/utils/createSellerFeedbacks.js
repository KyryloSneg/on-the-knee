const { faker } = require("@faker-js/faker");
const { MIN_FEEDBACK_IMAGE_WIDTH, MAX_FEEDBACK_IMAGE_WIDTH, MIN_FEEDBACK_IMAGE_HEIGHT, MAX_FEEDBACK_IMAGE_HEIGHT, MOCK_USER, REAL_USER } = require("./consts");
const findAverageNum = require("../../src/utils/findAverageNum");

module.exports = (feedbacks, sellerId) => {
  let rates = [];

  for (let i = 0; i < 5; i++) {
    const hasImages = i % 2;
    let images = [];

    if (hasImages) {
      const width = faker.number.int({ min: MIN_FEEDBACK_IMAGE_WIDTH, max: MAX_FEEDBACK_IMAGE_WIDTH });
      const height = faker.number.int({ min: MIN_FEEDBACK_IMAGE_HEIGHT, max: MAX_FEEDBACK_IMAGE_HEIGHT });
  
      for (let j = 0; j < faker.number.int({ min: 2, max: 4 }); j++) {
        images.push(faker.image.url({ width, height }));
      }
    }

    const rate = faker.number.int({ min: 1, max: 5 });
    rates.push(rate);

    const isRealUser = faker.datatype.boolean(0.4);
    const userId = isRealUser ? REAL_USER._id : MOCK_USER._id;

    const feedback = {
      "id": feedbacks.length + 1,
      "sellerId": sellerId,
      "userId": userId,
      "images": images,
      "message": faker.lorem.text(),
      "rate": rate,
      "date": faker.date.recent(),
    }

    feedbacks.push(feedback);

  }
  
  const avgRating = findAverageNum(rates);
  return avgRating;
}