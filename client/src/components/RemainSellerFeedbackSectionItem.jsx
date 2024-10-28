import { useState } from 'react';
import UIButton from "./UI/uiButton/UIButton";
import { SELLER_ROUTE, SELLER_WRITE_A_FEEDBACK_ROUTE } from "utils/consts";
import CommentsList from "./CommentsList";
import dropdownArrowIcon from "../assets/expand_more.svg";
import { v4 } from "uuid";
import { Link } from "react-router-dom";

const RemainSellerFeedbackSectionItem = ({ sellerFeedbacksObj }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sellerIdSlug = `${sellerFeedbacksObj.seller.id}--${sellerFeedbacksObj.seller.slug}`;
  const sellerRoute = SELLER_ROUTE + sellerIdSlug;

  const hasAnyFeedbackRemained = !!sellerFeedbacksObj.feedbacks?.length;

  const linkWithSellerNameImg = (
    <Link to={sellerRoute} className="remain-seller-dev-feedback-li-name-img link-colors">
      <div className="remain-seller-dev-feedback-li-img-wrap">
        <img src={sellerFeedbacksObj.seller.logo} alt="" draggable="false" />
      </div>
      <span>{sellerFeedbacksObj.seller.name}</span>
    </Link>
  );

  if (hasAnyFeedbackRemained) {
    const commentsListId = v4();
    
    return (
      <div className="remain-seller-dev-feedback-li-with-comments">
        <button 
          aria-expanded={isExpanded}
          aria-controls={commentsListId}
          aria-label={`${isExpanded ? "Hide" : "Show"} your feedbacks of the seller`}
          onClick={() => setIsExpanded(!isExpanded)} 
        >
          {linkWithSellerNameImg}
          <img
            src={dropdownArrowIcon}
            alt={isExpanded ? "Collapse" : "Expand"}
            className={isExpanded ? "rotated" : ""}
            draggable="false"
          />
        </button>
        {isExpanded && (
          <CommentsList
            type="sellerFeedbacks" 
            comments={sellerFeedbacksObj.feedbacks} 
            singularCommentWord="feedback" 
            id={commentsListId}
          />
        )}
      </div>
    );
  };

  const sellerFeedbacksRoute = SELLER_WRITE_A_FEEDBACK_ROUTE.replace(":sellerIdSlug", sellerIdSlug);

  return (
    <div className="remain-seller-dev-feedback-li-empty">
      {linkWithSellerNameImg}
      <UIButton
        isLink={true}
        to={sellerFeedbacksRoute}
      >
        Write a feedback
      </UIButton>
    </div>
  );
}

export default RemainSellerFeedbackSectionItem;
