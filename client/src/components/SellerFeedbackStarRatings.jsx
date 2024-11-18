import "./styles/SellerFeedbackStarRatings.css";
import StarRating from "./UI/starRating/StarRating";

const SellerFeedbackStarRatings = ({ isUpToDateVal, deliverySpeedVal, serviceQualityVal, idStart, size = 16 }) => {
  const isUpToDateParaId = `${idStart}-seller-feedback-is-up-to-date-p`;
  const deliverySpeedParaId = `${idStart}-seller-feedback-delivery-speed-p`;
  const serviceQualityParaId = `${idStart}-seller-feedback-service-quality-p`;

  return (
    <div className="seller-feedback-star-ratings">
      <div className="seller-feedback-star-rating-wrap">
        <p id={isUpToDateParaId}>Up-to-date</p>
        <StarRating
          readOnlyValue={isUpToDateVal}
          size={size}
          id={`${idStart}-up-to-date-original-comment-rating`}
          aria-labelledby={isUpToDateParaId}
        />
      </div>
      <div className="seller-feedback-star-rating-wrap">
        <p id={deliverySpeedParaId}>Delivery speed</p>
        <StarRating
          readOnlyValue={deliverySpeedVal}
          size={size}
          id={`${idStart}-del-speed-original-comment-rating`}
          aria-labelledby={deliverySpeedParaId}
        />
      </div>
      <div className="seller-feedback-star-rating-wrap">
      <p id={serviceQualityParaId}>Service quality</p>
        <StarRating
          readOnlyValue={serviceQualityVal}
          size={size}
          id={`${idStart}-service-original-comment-rating`}
          aria-labelledby={serviceQualityParaId}
        />
      </div>
    </div>
  );
}

export default SellerFeedbackStarRatings;
