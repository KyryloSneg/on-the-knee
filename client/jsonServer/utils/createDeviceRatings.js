const { faker } = require('@faker-js/faker');

module.exports = (ratings, ratingId, deviceId) => {
  let devRatingsValues = [];

  for (let j = 1; j <= faker.number.int({min: 1, max: 10}); j++) {
    let rating = {
      "id": ratingId,
      "deviceId": deviceId,
      "userId": j,
      "value": faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    }

    devRatingsValues.push(rating.value);
    ratings.push(rating);

    ratingId++;
  }

  return devRatingsValues;
}