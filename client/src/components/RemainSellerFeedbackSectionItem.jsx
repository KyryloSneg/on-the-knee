import UIButton from "./UI/uiButton/UIButton";
import { SELLER_ROUTE, SELLER_WRITE_A_FEEDBACK_ROUTE } from "utils/consts";
import CommentsList from "./CommentsList";
import { v4 } from "uuid";
import { Link } from "react-router-dom";
import UIDetails from "./UI/uiDetails/UIDetails";

const RemainSellerFeedbackSectionItem = ({ type, sellerFeedbacksObj }) => {
  const sellerIdSlug = `${sellerFeedbacksObj.seller.id}--${sellerFeedbacksObj.seller.slug}`;
  const sellerRoute = SELLER_ROUTE + sellerIdSlug;

  const hasAnyFeedbackRemained = !!sellerFeedbacksObj.feedbacks?.length;

  const linkWithSellerNameImg = (
    <Link to={sellerRoute} className="remain-seller-dev-feedback-li-name-img link-colors">
      <div className="remain-seller-dev-feedback-li-img-wrap">
        <img src={sellerFeedbacksObj.seller.logo} alt="" draggable="false" />
      </div>
      <h4>{sellerFeedbacksObj.seller.name}</h4>
    </Link>
  );

  if (hasAnyFeedbackRemained) {
    const commentsListId = v4();
    return (
      <UIDetails 
        btnChildren={linkWithSellerNameImg}
        contentChildren={
          <CommentsList
            type="sellerFeedbacks" 
            comments={sellerFeedbacksObj.feedbacks} 
            singularCommentWord="feedback" 
            isInModal={type === "modal"}
            areUserFeedbacks={type === "userFeedbacks"}
            id={commentsListId}
          />
        }
        contentId={commentsListId}
        propsClassName="remain-seller-dev-feedback-li-with-comments"
      />
    );
  };

  const sellerFeedbacksRoute = SELLER_WRITE_A_FEEDBACK_ROUTE.replace(":sellerIdSlug", sellerIdSlug);

  return (
    <section className="remain-seller-dev-feedback-li-empty">
      {linkWithSellerNameImg}
      <UIButton
        isLink={true}
        to={sellerFeedbacksRoute}
      >
        Write a feedback
      </UIButton>
    </section>
  );
};

export default RemainSellerFeedbackSectionItem;
