import findAverageNum from "../utils/findAverageNum";
import SellerFeedbackStarRatings from "./SellerFeedbackStarRatings";
import "./styles/MainSellerPageSeparateRatingSection.css";

const MainSellerPageSeparateRatingSection = ({ feedbacksAmountObj }) => {
  const serviceQualityAvg = findAverageNum(feedbacksAmountObj["service-quality-rate"]);
  const upToDateAvg = findAverageNum(feedbacksAmountObj["is-up-to-date-rate"]);
  const deliverySpeedAvg = findAverageNum(feedbacksAmountObj["delivery-speed-rate"]);

  return (
    <section className="main-seller-page-separate-rating-section">
      <h3>Separate ratings</h3>
      <SellerFeedbackStarRatings 
        serviceQualityVal={serviceQualityAvg}
        isUpToDateVal={upToDateAvg}
        deliverySpeedVal={deliverySpeedAvg}
        idStart="main-seller-page-separate-star-rating"
        size={20}
      />
    </section>
  );
}

export default MainSellerPageSeparateRatingSection;
