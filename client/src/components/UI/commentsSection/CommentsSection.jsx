import "./CommentsSection.css";
import { useContext } from "react";
import ReadOnlyStarRating from "../readOnlyStarRating/ReadOnlyStarRating";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import CommentsList from "./CommentsList";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";

const POSSIBLE_TYPES = ["deviceFeedbacks", "deviceQuestions", "sellerFeedbacks"];
const CommentsSection = observer(({ type, comments, isFullVersion = true, device = null, seller = null }) => {
  const { user } = useContext(Context);

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comments Section is not defined or incorrect");
  if (
    ((type === "deviceFeedbacks" || type === "deviceQuestions") && !device)
    || (type === "sellerFeedbacks" && !seller)
    || !comments
  ) return <div />;

  function createComment() {
    if (user.isAuth) {
      // open creating comment modal
    } else {
      // open user login modal
    }
  }

  let commentWord = "";
  const commentsAmount = comments?.length || 0;

  let headingTextPart = "";
  let createCommentButtonText = "";

  if (type === "deviceFeedbacks") {
    commentWord = comments?.length > 1 ? "feedbacks" : "feedback";
    headingTextPart = "Device feedbacks";
    createCommentButtonText = "Remain your feedback";
  } else if (type === "deviceQuestions") {
    commentWord = comments?.length > 1 ? "questions" : "question";
    headingTextPart = "Questions";
    createCommentButtonText = "Remain your question";
  } else if (type === "sellerFeedbacks") {
    commentWord = comments?.length > 1 ? "feedbacks" : "feedback";
    headingTextPart = "Seller feedbacks";
    createCommentButtonText = "Remain your feedback";
  }

  // top level means original feedback / question, not reply / answer
  let allTopLevelImages = [];
  for (let comment of comments) {
    allTopLevelImages = allTopLevelImages.concat(comment.images);
  }

  return (
    <section className="comments-section device-page-section">
      <h2>
        {headingTextPart}
        {isFullVersion && (
          (type === "deviceFeedbacks" || type === "deviceQuestions")
            ? <span className="heading-item-name-part">{device.name}</span>
            : <span className="heading-item-name-part">{seller.name}</span>
        )}
      </h2>
      <div className="comments-star-rating-p-wrapper">
        <ReadOnlyStarRating
          value={device.rating}
          id={`${type}-comments-section-rating`}
          width={20}
          height={20}
        />
        <p>{commentsAmount} {commentWord}</p>
      </div>
      <CustomScrollbar
        children={
          <ul className="comments-section-all-images">
            {allTopLevelImages.map((src, index) =>
              <li key={index}>
                <button>
                  <img src={src} alt="" draggable="false" />
                </button>
              </li>
            )}
          </ul>
        }
      />
      <button
        className="create-comment-btn"
        onClick={createComment}
      >
        {createCommentButtonText}
      </button>
      <CommentsList type={type} comments={comments} />
    </section>
  );
});

export default CommentsSection;
