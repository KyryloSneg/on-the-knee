import { patchOneSeller } from "http/SellersAPI";

export default async function updateSellerRating(updatedSellerFeedbacks, sellerId) {
  // idk what to do if the fetch has returned something wrong
  if (Array.isArray(updatedSellerFeedbacks)) {
    let feedbacksRatingSum = 0;
    let feedbacksRatings = [];

    for (let feedback of updatedSellerFeedbacks) {
      feedbacksRatingSum += (
        feedback["is-up-to-date-rate"] + feedback["delivery-speed-rate"] + feedback["service-quality-rate"]
      );

      feedbacksRatings.push(feedback["is-up-to-date-rate"]);
      feedbacksRatings.push(feedback["delivery-speed-rate"]);
      feedbacksRatings.push(feedback["service-quality-rate"]);
    }

    if (!feedbacksRatingSum.length) {
      await patchOneSeller(sellerId, { rating: "0.0" });
      return;
    }

    const newRating = (feedbacksRatingSum / feedbacksRatings.length).toFixed(1);

    // we can't update seller state immediately from the seller page,
    // because it will invoke 1 billion re-renders that i don't want to handle
    await patchOneSeller(sellerId, { rating: newRating });
  }
}