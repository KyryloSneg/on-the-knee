import "./styles/SellerFeedbackStarRatings.css";
import StarRating from "./UI/starRating/StarRating";

const SellerFeedbackStarRatings = ({ serviceQualityVal, isUpToDateVal, deliverySpeedVal, idStart, size = 16 }) => {
  return (
    <div className="seller-feedback-star-ratings">
      <div className="seller-feedback-star-rating-wrap">
        <p>Service quality</p>
        <StarRating
          readOnlyValue={serviceQualityVal}
          width={size}
          height={size}
          id={`${idStart}-service-original-comment-rating`}
        />
      </div>
      <div className="seller-feedback-star-rating-wrap">
        <p>Up-to-date</p>
        <StarRating
          readOnlyValue={isUpToDateVal}
          width={size}
          height={size}
          id={`${idStart}-up-to-date-original-comment-rating`}
        />
      </div>
      <div className="seller-feedback-star-rating-wrap">
        <p>Delivery speed</p>
        <StarRating
          readOnlyValue={deliverySpeedVal}
          width={size}
          height={size}
          id={`${idStart}-del-speed-original-comment-rating`}
        />
      </div>
    </div>
  );
}

export default SellerFeedbackStarRatings;
