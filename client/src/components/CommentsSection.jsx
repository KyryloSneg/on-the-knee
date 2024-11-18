import "./styles/CommentsSection.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import CommentsList from "./CommentsList";
import CommentImagesSection from "./CommentImagesSection";
import setDeviceFeedbackModalVisibility from "../utils/setDeviceFeedbackModalVisibility";
import StarRating from "./UI/starRating/StarRating";
import setQuestionCommentModalVisibility from "../utils/setQuestionCommentModalVisibility";
import UIButton from "./UI/uiButton/UIButton";

const POSSIBLE_TYPES = ["deviceFeedbacks", "deviceQuestions", "sellerFeedbacks"];
const CommentsSection = observer(({ type, comments, isFullVersion = true, device = null, seller = null }) => {
  const { app, deviceStore, user } = useContext(Context);
  const createCommentBtnRef = useRef(null);
  const [isToShowSellerCantRemainComment, setIsToShowSellerCantRemainComment] = useState(false);

  const isUserASellerOrManager = user.user?.roles?.includes("SELLER") || user.user?.roles?.includes("SELLER-MANAGER");

  useEffect(() => {
    if (!isUserASellerOrManager) setIsToShowSellerCantRemainComment(false);
  }, [isUserASellerOrManager]);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comments Section is not defined or incorrect");
  if (
    ((type === "deviceFeedbacks" || type === "deviceQuestions") && !device)
    || (type === "sellerFeedbacks" && !seller)
    || !comments
  ) return <div />;

  function createComment() {
    if (isUserASellerOrManager) {
      setIsToShowSellerCantRemainComment(true);
      return;
    }

    deviceStore.setSelectedDeviceId(device.id);

    if (type === "deviceFeedbacks") {
      app.setDeviceFeedbackModalBtnRef(createCommentBtnRef);
      setDeviceFeedbackModalVisibility(true, app);
    } else if (type === "deviceQuestions") {
      app.setQuestionCommentModalBtnRef(createCommentBtnRef);
      setQuestionCommentModalVisibility(true, app);
    }
  }

  let commentWord = "";
  let singularCommentWord = "";
  const commentsAmount = comments?.length || 0;

  let headingTextPart = "";
  let createCommentButtonText = "";

  if (type === "deviceFeedbacks") {
    singularCommentWord = "feedback";
    commentWord = comments?.length > 1 ? "feedbacks" : singularCommentWord;
    headingTextPart = "Device feedbacks";
    createCommentButtonText = "Remain your feedback";
  } else if (type === "deviceQuestions") {
    singularCommentWord = "question";
    commentWord = comments?.length > 1 ? "questions" : singularCommentWord;
    headingTextPart = "Questions";
    createCommentButtonText = "Remain your question";
  } else if (type === "sellerFeedbacks") {
    singularCommentWord = "feedback";
    commentWord = comments?.length > 1 ? "feedbacks" : singularCommentWord;
    headingTextPart = "Seller feedbacks";
  }

  // top level means original feedback / question, not reply / answer
  let allTopLevelImageObjs = [];
  if (type !== "sellerFeedbacks") {
    for (let comment of comments) {
      const imagesObj = {
        commentId: comment.id,
        images: comment.images
      };

      allTopLevelImageObjs.push(imagesObj);
    }
  }

  const isToShowRating = type === "deviceFeedbacks" || type === "sellerFeedbacks";

  return (
    <section className="comments-section device-page-section">
      <h2>
        {headingTextPart}
        {isFullVersion && (
          (type === "deviceFeedbacks" || type === "deviceQuestions")
            ? (
              <>
                <span> for </span>
                <span className="heading-item-name-part">{device.name}</span>
              </>
            )
            : (
              <>
                <span> for </span>
                <span className="heading-item-name-part">{seller.name}</span>
              </>
            )
        )}
      </h2>
      {isToShowRating &&
        <div className="comments-star-rating-p-wrapper">
          <StarRating
            readOnlyValue={device?.rating || seller?.rating}
            id={`comments-section-${type}-comments-section-rating`}
            size={20}
          />
          <p>{commentsAmount} {commentWord}</p>
        </div>
      }
      {type !== "sellerFeedbacks" &&
        <>
          <CommentImagesSection imagesObjs={allTopLevelImageObjs} type={type} />
          <UIButton
            variant="primary2"
            children={createCommentButtonText}
            className="create-comment-btn" 
            onClick={createComment} 
            ref={createCommentBtnRef}
          />
          {isToShowSellerCantRemainComment && (
            <p className="seller-cant-remain-comment-error-msg">
              A seller or a seller manager can't remain a {singularCommentWord}
            </p>
          )}
        </>
      }
      <CommentsList type={type} comments={comments} singularCommentWord={singularCommentWord} />
    </section>
  );
});

export default CommentsSection;
