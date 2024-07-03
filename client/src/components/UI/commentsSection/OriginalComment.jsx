import "./OriginalComment.css";
import getDateStr from "../../../utils/getDateStr";
import CommentImagesSection from "./CommentImagesSection";
import replyIcon from "../../../assets/reply_24x24_7373FF.svg";
import filledLikeIcon from "../../../assets/thumb_up_24x24_filled_3348E6.svg";
import notFilledLikeIcon from "../../../assets/thumb_up_24x24_not-filled_3348E6.svg";
import filledDislikeIcon from "../../../assets/thumb_down_24x24_filled_3348E6.svg";
import notFilledDislikeIcon from "../../../assets/thumb_down_24x24_not-filled_3348E6.svg";
import { useContext, useState } from "react";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import DeviceFeedbackRatesActions from "../../../utils/DeviceFeedbackRatesActions";
import useFetchingDeviceFeedbackRates from "../../../hooks/useFetchingDeviceFeedbackRates";
import { v4 } from "uuid";
import setReplyModalVisibility from "../../../utils/setReplyModalVisibility";
import StarRating from "../starRating/StarRating";
import setAnswerModalVisibility from "../../../utils/setAnswerModalVisibility";

const OriginalComment = observer(({ comment, user, type, singularCommentWord = "comment" }) => {
  const { user: userStore, app } = useContext(Context);

  // we must update likes and dislikes after user click one of them
  const [likes, setLikes] = useState(comment["device-feedback-likes"]);
  const [dislikes, setDislikes] = useState(comment["device-feedback-dislikes"]);

  const {
    fetchingLikes,
    fetchingDislikes
  } = useFetchingDeviceFeedbackRates(comment.id, setLikes, setDislikes);

  const createdAtDate = new Date(comment.date);
  const createdAtDateStr = getDateStr(createdAtDate);

  let likeFromUser;
  let dislikeFromUser;

  if (type === "deviceFeedbacks") {
    likeFromUser = likes.find(like => like.userId === userStore.user?._id);
    dislikeFromUser = dislikes.find(dislike => dislike.userId === userStore.user?._id);
  }

  const [isAlreadyLiked, setIsAlreadyLiked] = useState(!!likeFromUser);
  const [isAlreadyDisliked, setIsAlreadyDisliked] = useState(!!dislikeFromUser);
  const [isChangingRate, setIsChangingRate] = useState(false);
  const [isCantRateYourCommentError, setIsCantRateYourCommentError] = useState(false)

  const isYourComment = (userStore.user?._id === user?.id && !!user);

  function reply() {
    app.setSelectedDeviceId(comment.deviceId);

    if (type === "deviceFeedbacks") {
      app.setSelectedDeviceFeedbackId(comment.id);
      setReplyModalVisibility(true, app);
    } else if (type === "deviceQuestions") {
      app.setSelectedDeviceQuestionId(comment.id);
      setAnswerModalVisibility(true, app);
    }
  }

  async function removeLike() {
    if (!userStore.isAuth) {
      // open user login modal
      return;
    };

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    // could be undefined
    const error = await DeviceFeedbackRatesActions.removeLikeRate(likeFromUser.id, setIsAlreadyLiked);
    if (!error) fetchingLikes();
  }

  async function removeDislike() {
    if (!userStore.isAuth) {
      // open user login modal
      return;
    };

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    const error = await DeviceFeedbackRatesActions.removeDislikeRate(dislikeFromUser.id, setIsAlreadyDisliked);
    if (!error) fetchingDislikes();
  }

  async function rateComment(isLike) {
    if (!userStore.isAuth) {
      // open user login modal
      return;
    };

    // we can't like and dislike a comment at the same time
    if (isChangingRate) return;

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    if (isLike) {

      if (isAlreadyLiked) {
        await removeLike();
      } else {
        const likeObject = {
          // some random id (implementation might be different from this one)
          "id": v4(),
          "userId": userStore.user?._id,
          "device-feedbackId": comment.id,
        }

        const error = await DeviceFeedbackRatesActions.likeFeedback(likeObject, setIsAlreadyLiked, setIsChangingRate);
        // preventing redundant fetches if delete request failed
        if (!error) fetchingLikes();

        if (isAlreadyDisliked) {
          // we can't like and dislike a feedback at the same time
          await removeDislike();
        }
      }

    } else {

      if (isAlreadyDisliked) {
        await removeDislike();
      } else {
        const dislikeObject = {
          "id": v4(),
          "userId": userStore.user?._id,
          "device-feedbackId": comment.id,
        }

        const error = await DeviceFeedbackRatesActions.dislikeFeedback(dislikeObject, setIsAlreadyDisliked, setIsChangingRate);
        if (!error) fetchingDislikes();

        if (isAlreadyLiked) {
          await removeLike();
        }
      }

    }
  }

  const isToShowRating = type === "deviceFeedbacks" || type === "sellerFeedbacks";

let commentReplyWord = "Reply";
if (type === "deviceQuestions") {
  commentReplyWord = "Answer";
}

return (
  <section className="original-comment">
    <div className="comment-username-date-wrap">
      <p className="comment-username">
        {/* TODO: delete (user?.name || "Mock") etc. in production build maybe */}
        {comment?.isAnonymously
          ? "Anonym"
          : `${user?.name || "Mock"} ${user?.surname || "User"}`
        }
      </p>
      <p className="comment-date">
        {createdAtDateStr}
      </p>
    </div>
    {isToShowRating &&
      <StarRating
        readOnlyValue={comment.rate}
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
    {(type === "deviceFeedbacks" || type === "deviceQuestions") &&
      <div className="original-comment-btn-group">
        <button
          className="original-comment-reply-btn"
          onClick={reply}
        >
          <img src={replyIcon} alt="" draggable="false" />
          {commentReplyWord}
        </button>

        <div className="original-comment-rate-group-error-wrap">
          <div className="original-comment-rate-btn-group">
            <button
              onClick={() => rateComment(true)}
              aria-label={
                isAlreadyLiked
                  ? `Remove your like from the ${singularCommentWord}`
                  : `Like the ${singularCommentWord}`
              }
            >
              {isAlreadyLiked
                ? <img src={filledLikeIcon} alt="Remove like" draggable="false" />
                : <img src={notFilledLikeIcon} alt="Like" />
              }
              <span>{likes?.length}</span>
            </button>
            <button
              onClick={() => rateComment(false)}
              aria-label={
                isAlreadyDisliked
                  ? `Remove your dislike from the ${singularCommentWord}`
                  : `Dislike the ${singularCommentWord}`
              }
            >
              {isAlreadyDisliked
                ? <img src={filledDislikeIcon} alt="Remove dislike" draggable="false" />
                : <img src={notFilledDislikeIcon} alt="Dislike" draggable="false" />
              }
              <span>{dislikes?.length}</span>
            </button>
          </div>
          {isCantRateYourCommentError &&
            <p>You can't rate your own {singularCommentWord}</p>
          }
        </div>
      </div>
    }
  </section>
);
});

export default OriginalComment;
