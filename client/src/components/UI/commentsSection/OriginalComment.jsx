import "./OriginalComment.css";
import getDateStr from "../../../utils/getDateStr";
import ReadOnlyStarRating from "../readOnlyStarRating/ReadOnlyStarRating";
import CommentImagesSection from "./CommentImagesSection";
import replyIcon from "../../../assets/reply_24x24_7373FF.svg";
import filledLikeIcon from "../../../assets/thumb_up_24x24_filled_3348E6.svg";
import notFilledLikeIcon from "../../../assets/thumb_up_24x24_not-filled_3348E6.svg";
import filledDislikeIcon from "../../../assets/thumb_down_24x24_filled_3348E6.svg";
import notFilledDislikeIcon from "../../../assets/thumb_down_24x24_not-filled_3348E6.svg";
import { useContext } from "react";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";

const OriginalComment = observer(({ comment, user, type, singularCommentWord = "comment" }) => {
  const { user: userStore } = useContext(Context);
  const createdAtDate = new Date(comment.date);
  const createdAtDateStr = getDateStr(createdAtDate);

  const isAlreadyLiked = false;
  const isAlreadyDisliked = true;

  function reply() {
    if (userStore.isAuth) {
      // open comment modal with type="reply"
    } else {
      // open user login modal
    }
  }

  function rateComment(isLike) {
    if (isAlreadyLiked || isAlreadyDisliked) return;
    if (isLike) {
      // like
    } else {
      // dislike
    }
  }

  const isToShowRating = type === "deviceFeedbacks" || type === "sellerFeedbacks";

  let commentReplyWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyWord = "Answer";
  }

  console.log(comment);
  return (
    <section className="original-comment">
      <div className="comment-username-date-wrap">
        <p className="comment-username">
          {comment?.isAnonymously
            ? "Anonym"
            : `${user?.name} ${user?.surname}`
          }
        </p>
        <p className="comment-date">
          {createdAtDateStr}
        </p>
      </div>
      {isToShowRating &&
        <ReadOnlyStarRating 
          value={comment.rate} 
          id={`${type}-${comment.id}-original-comment-rating`}
        />
      }
      {comment.message &&
        <p className="original-comment-message">
          {comment.message}
        </p>
      }
      {(comment?.advantages || comment?.disadvantages) &&
        <dl className="original-comment-dis-and-advantages-list">
          {comment?.advantages &&
            <div>
              <dt>Advantages: </dt>
              <dd>{comment.advantages}</dd>
            </div>
          }
          {comment?.disadvantages &&
            <div>
              <dt>Disadvantages: </dt>
              <dd>{comment.disadvantages}</dd>
            </div>
          }
        </dl>
      }
      {!!comment.images.length &&
        <CommentImagesSection images={comment.images} />
      }
      <div className="original-comment-btn-group">
        <button
          className="original-comment-reply-btn"
          onClick={reply}
        >
          <img src={replyIcon} alt="" draggable="false" />
          {commentReplyWord}
        </button>
        {type === "deviceFeedbacks" &&
          <div className="original-comment-rate-btn-group">
            <button
              onClick={() => rateComment(true)}
              aria-label={`Like the ${singularCommentWord}`}
            >
              {isAlreadyLiked
                ? <img src={filledLikeIcon} alt="Dislike" draggable="false" />
                : <img src={notFilledLikeIcon} alt="Dislike" />
              }
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => rateComment(false)}
              aria-label={`Dislike the ${singularCommentWord}`}
            >
              {isAlreadyDisliked
                ? <img src={filledDislikeIcon} alt="Dislike" draggable="false" />
                : <img src={notFilledDislikeIcon} alt="Dislike" draggable="false" />
              }
              <span>{comment.dislikes}</span>
            </button>
          </div>
        }
      </div>
    </section>
  );
});

export default OriginalComment;
