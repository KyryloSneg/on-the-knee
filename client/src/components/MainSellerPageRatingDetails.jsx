import "./styles/MainSellerPageRatingDetails.css";
import CustomProgressBar from "./UI/customProgressBar/CustomProgressBar";
import Star from "./UI/starRating/Star";

const MainSellerPageRatingDetails = ({ ratingsObj, feedbacksAmount }) => {
  return (
    <dl className="main-seller-page-rating-details">
      {Object.entries(ratingsObj).map(([name, value]) => 
        <div key={`${name}-${value}`}>
          <dt>
            <Star starIndex={1} value={1} width={14} height={14} starKey={`${name}-${value}`} />
            <span>{name}</span>
          </dt>
          <dd >
            <CustomProgressBar progress={value / feedbacksAmount * 100} />
            <span>{value}</span>
          </dd>
        </div>
      )}
    </dl>
  );
}

export default MainSellerPageRatingDetails;
