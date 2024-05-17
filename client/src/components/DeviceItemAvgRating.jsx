import { Link } from "react-router-dom";
import ReadOnlyStarRating from "./UI/readOnlyStarRating/ReadOnlyStarRating";
import "./styles/DeviceItemAvgRating.css";
import { DEVICE_COMMENTS_ROUTE } from "../utils/consts";

const DeviceItemAvgRating = ({ rating = null, feedbackAmount = null, deviceId = null, defaultCombination = null }) => {
  const deviceRouteCombo = defaultCombination.combinationString || "default";
  const to = DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", `${deviceId}--${deviceRouteCombo}`);

  if (rating >= 0) {
    const correctedFeedbackForm = feedbackAmount === 1 ? "feedback" : "feedbacks";
    return (
      <div className="main-device-rating-wrap">
        <Link 
          to={to} 
          className="main-device-rating link-colors" 
          aria-label={`${rating} stars of 5; go to device's feedbacks section`}
        >
          <ReadOnlyStarRating value={+rating} id={deviceId} />
          <span className="device-item-feedback-num">{feedbackAmount} {correctedFeedbackForm}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="main-device-rating-wrap">
      <Link to={to} className="main-device-rating link-colors">
        <span className="device-item-remain-feedback">Remain feedback</span>
      </Link>
    </div>
  );
}

export default DeviceItemAvgRating;
