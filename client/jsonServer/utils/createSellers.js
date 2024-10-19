const { faker } = require("@faker-js/faker");
const { LOGO_WIDTH, LOGO_HEIGHT, POSSIBLE_SELLER_WORK_SCHEDULES } = require("./consts");
const createSellerFeedbacks = require("./createSellerFeedbacks");
const StringActions = require("./StringActions");
const createSellerQuestions = require("./createSellerQuestions");
const { parsePhoneNumber } = require("libphonenumber-js");

module.exports = (sellerQuestions) => {
  let sellers = [];
  let sellerFeedbacks = [];

  for (let i = 0; i < 10; i++) {
    const rating = createSellerFeedbacks(sellerFeedbacks, sellers.length + 1);
    const name = faker.company.name();
    const slug = StringActions.nameToSlug(name);
    const schedule = POSSIBLE_SELLER_WORK_SCHEDULES[
      faker.number.int({ min: 0, max: POSSIBLE_SELLER_WORK_SCHEDULES.length - 1 })
    ];

    let phoneNumber;
    const numberObj = parsePhoneNumber("+380 " + faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{4}/));
    const internationalNumber = numberObj.formatInternational(); 
    phoneNumber = internationalNumber;

    const seller = {
      "id": sellers.length + 1,
      "logo": faker.image.url({ width: LOGO_WIDTH, height: LOGO_HEIGHT }),
      "name": name,
      "slug": slug,
      "rating": rating,
      "schedule": schedule,
      "phoneNumber": phoneNumber,
    }

    sellers.push(seller);

    createSellerQuestions(sellerQuestions, seller.id);
  }

  return {
    sellers,
    sellerFeedbacks,
  };
}