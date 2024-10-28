import { Link } from "react-router-dom";
import { DEVICE_COMMENTS_ROUTE, DEVICE_ROUTE } from "../utils/consts";
import UIButton from "./UI/uiButton/UIButton";
import CommentsList from "./CommentsList";
import { useState } from "react";
import dropdownArrowIcon from "../assets/expand_more.svg";
import { v4 } from "uuid";

const RemainSellerDevFeedbackDevListItem = ({ comboFeedbackObj }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const deviceRouteCombo = comboFeedbackObj.deviceCombination.combinationString || "default";

  const deviceTo = DEVICE_ROUTE + `${comboFeedbackObj.deviceCombination.deviceId}--${deviceRouteCombo}`;
  const feedbackPageTo = DEVICE_COMMENTS_ROUTE.replace(
    ":deviceIdCombo", `${comboFeedbackObj.deviceCombination.deviceId}--${deviceRouteCombo}`
  );

  const hasAnyFeedbackRemained = !!comboFeedbackObj.feedbacks?.length;
  const linkWithDevNameImg = (
    <Link to={deviceTo} className="remain-seller-dev-feedback-li-name-img link-colors">
      <div className="remain-seller-dev-feedback-li-img-wrap">
        <img src={comboFeedbackObj.deviceCombination.images[0].src} alt="" draggable="false" />
      </div>
      <span>{comboFeedbackObj.deviceCombination.device.name} ({comboFeedbackObj.deviceCombination.sku})</span>
    </Link>
  );

  if (hasAnyFeedbackRemained) {
    const commentsListId = v4();
    return (
      <div className="remain-seller-dev-feedback-li-with-comments">
        <button 
          aria-expanded={isExpanded}
          aria-controls={commentsListId}
          aria-label={`${isExpanded ? "Hide" : "Show"} your feedbacks of the device`}
          onClick={() => setIsExpanded(!isExpanded)} 
        >
          {linkWithDevNameImg}
          <img
            src={dropdownArrowIcon}
            alt={isExpanded ? "Collapse" : "Expand"}
            className={isExpanded ? "rotated" : ""}
            draggable="false"
          />
        </button>
        {isExpanded && (
          <CommentsList 
            type="deviceFeedbacks" 
            comments={comboFeedbackObj.feedbacks} 
            singularCommentWord="feedback" 
            id={commentsListId}
          />
        )}
      </div>
    );
  };

  return (
    <div className="remain-seller-dev-feedback-li-empty">
      {linkWithDevNameImg}
      <UIButton variant="primary2" isLink={true} to={feedbackPageTo}>
        Rate this device
      </UIButton>
    </div>
  );
};

export default RemainSellerDevFeedbackDevListItem;
