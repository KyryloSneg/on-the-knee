import "./styles/MainSellerPageRatingDetails.css";
import CustomProgressBar from "./UI/customProgressBar/CustomProgressBar";
import Star from "./UI/starRating/Star";

const MainSellerPageRatingDetails = ({ ratingsObj, feedbacksAmount }) => {
  return (
    <dl className="main-seller-page-rating-details">
      {Object.entries(ratingsObj).map(([name, value]) => 
        <div key={`${name}-${value}`}>
          <dt>
            <Star starIndex={1} value={1} size={14} starKey={`${name}-${value}`} />
            <span>{name}</span>
          </dt>
          <dd >
            {/* do not show Infinity if we have no feedbacks, show zero instead */}
            <CustomProgressBar progress={feedbacksAmount === 0 ? 0 : (value / feedbacksAmount) * 100} />
            <span>{value}</span>
          </dd>
        </div>
      )}
    </dl>
  );
}

export default MainSellerPageRatingDetails;
