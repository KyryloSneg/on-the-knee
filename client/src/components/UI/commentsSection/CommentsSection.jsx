import "./CommentsSection.css";
import { useContext } from "react";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import CommentsList from "./CommentsList";
import CommentImagesSection from "./CommentImagesSection";
import setDeviceFeedbackModalVisibility from "../../../utils/setDeviceFeedbackModalVisibility";
import StarRating from "../starRating/StarRating";

const POSSIBLE_TYPES = ["deviceFeedbacks", "deviceQuestions", "sellerFeedbacks"];
const CommentsSection = observer(({ type, comments, isFullVersion = true, device = null, seller = null }) => {
  const { app } = useContext(Context);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comments Section is not defined or incorrect");
  if (
    ((type === "deviceFeedbacks" || type === "deviceQuestions") && !device)
    || (type === "sellerFeedbacks" && !seller)
    || !comments
  ) return <div />;

  function createComment() {
    setDeviceFeedbackModalVisibility(true, app);
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
  let allTopLevelImages = [];
  if (type !== "sellerFeedbacks") {
    for (let comment of comments) {
      allTopLevelImages = allTopLevelImages.concat(comment.images);
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
            readOnlyValue={device.rating}
            id={`comments-section-${type}-comments-section-rating`}
            width={20}
            height={20}
          />
          <p>{commentsAmount} {commentWord}</p>
        </div>
      }
      {type !== "sellerFeedbacks" &&
        <>
          <CommentImagesSection images={allTopLevelImages} />
          <button
            className="create-comment-btn"
            onClick={createComment}
          >
            {createCommentButtonText}
          </button>
        </>
      }
      <CommentsList type={type} comments={comments} singularCommentWord={singularCommentWord} />
    </section>
  );
});

export default CommentsSection;
