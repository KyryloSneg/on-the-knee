import "./styles/MainSellerPageOverallRatingSection.css";
import MainSellerPageOverallRating from "./MainSellerPageOverallRating";
import MainSellerPageRatingDetails from "./MainSellerPageRatingDetails";

const MainSellerPageOverallRatingSection = ({ seller, ratingsObj, feedbacksAmount }) => {
  return (
    <section className="main-seller-page-overall-rating-section">
      <h3>Overall rating</h3>
      <div>
        <MainSellerPageOverallRating seller={seller} feedbacksAmount={feedbacksAmount} />
        <MainSellerPageRatingDetails ratingsObj={ratingsObj} feedbacksAmount={feedbacksAmount} />
      </div>
    </section>
  );
}

export default MainSellerPageOverallRatingSection;
