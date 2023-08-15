const { faker } = require("@faker-js/faker");
const { LOGO_WIDTH, LOGO_HEIGHT } = require("./consts");
const createSellerFeedbacks = require("./createSellerFeedbacks");
const StringActions = require("./StringActions");

module.exports = () => {
  let sellers = [];
  let sellerFeedbacks = [];
  let sellerFeedbackReplies = [];

  for (let i = 0; i < 10; i++) {
    const rating = createSellerFeedbacks(sellerFeedbacks, sellerFeedbackReplies, sellers.length + 1);
    const name = faker.company.name();
    const slug = StringActions.nameToSlug(name);

    const seller = {
      "id": sellers.length + 1,
      "logo": faker.image.url({ width: LOGO_WIDTH, height: LOGO_HEIGHT }),
      "name": name,
      "slug": slug,
      "rating": rating,
    }

    sellers.push(seller);
  }

  return {
    sellers,
    sellerFeedbacks,
    sellerFeedbackReplies,
  };
}