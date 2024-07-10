import "./styles/MainSellerPageOverallRating.css";
import StarRating from "./UI/starRating/StarRating";

const MainSellerPageOverallRating = ({ seller, feedbacksAmount }) => {
  return (
    <div className="main-seller-page-overall-rating">
      <div className="overall-rating-p-stars-wrap">
        <p title={`Rating: ${seller.rating} out of 5`}>
          <span className="overall-rating-big-span">
            {seller.rating}
          </span>
          <span className="overall-rating-small-span">
            / 5
          </span>
        </p>
        <StarRating readOnlyValue={seller.rating} />
      </div>
      <p>{feedbacksAmount} ratings total</p>
    </div>
  );
}

export default MainSellerPageOverallRating;
