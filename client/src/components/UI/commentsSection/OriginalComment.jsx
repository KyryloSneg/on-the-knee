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
import DeviceCommentRatesActions from "../../../utils/DeviceCommentRatesActions";
import useFetchingDeviceCommentRates from "../../../hooks/useFetchingDeviceCommentRates";
import { v4 } from "uuid";
import setReplyModalVisibility from "../../../utils/setReplyModalVisibility";
import StarRating from "../starRating/StarRating";
import setAnswerModalVisibility from "../../../utils/setAnswerModalVisibility";
import SellerFeedbackStarRatings from "../../SellerFeedbackStarRatings";

const OriginalComment = observer(({ comment, user, type, singularCommentWord = "comment", isWithImages, closeGalleryModal }) => {
  const { user: userStore, app } = useContext(Context);

  // we must update likes and dislikes after user clicking on one of them
  const [likes, setLikes] = useState(comment["device-feedback-likes"] || comment["device-question-likes"]);
  const [dislikes, setDislikes] = useState(comment["device-feedback-dislikes"] || comment["device-question-dislikes"]);

  const {
    fetchingLikes,
    fetchingDislikes,
    likesFetchResultRef,
    dislikesFetchResultRef
  } = useFetchingDeviceCommentRates(comment.id, setLikes, setDislikes, type);

  const createdAtDate = new Date(comment.date);
  const createdAtDateStr = getDateStr(createdAtDate);

  let likeFromUser;
  let dislikeFromUser;

  likeFromUser = likes?.find(like => like.userId === userStore.user?._id);
  dislikeFromUser = dislikes?.find(dislike => dislike.userId === userStore.user?._id);

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

    if (closeGalleryModal) closeGalleryModal();
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
    const error = await DeviceCommentRatesActions.removeLikeRate(likeFromUser.id, type, setIsAlreadyLiked);
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

    const error = await DeviceCommentRatesActions.removeDislikeRate(dislikeFromUser.id, type, setIsAlreadyDisliked);
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
      // the next lines of code are created to prevent bug of liking (our example) / disliking
      // the same comment outside one (liking the comment in the modal first 
      // and doing the same thing in the comment section component)
      // the bug was causing double likes / dislikes etc.
      // So there is "isAlreadyLiked" state ISN'T updated yet, likesFetchResultRef.current IS updated version of likes
      // (we can't use likes from the "likes" state because they're not updated)
      // basically if we see differences in server's likes and client's ones,
      // set actual "isAlreadyLiked" / "isAlreadyDisliked" state, 
      // update opposite rate if user changed like to dislike or vice versa and DO NOT CHANGE A RATE AT ALL
      await fetchingLikes();
      const updatedLikes = likesFetchResultRef.current;

      const updatedIsAlreadyLiked = !!updatedLikes?.find(like => like.userId === userStore.user?._id);
      if (updatedIsAlreadyLiked !== isAlreadyLiked) {
        setIsAlreadyLiked(updatedIsAlreadyLiked);
        if (updatedIsAlreadyLiked && isAlreadyDisliked) {
          await fetchingDislikes();
          setIsAlreadyDisliked(false);
        }

        return;
      };

      if (isAlreadyLiked) {
        await removeLike();
      } else {
        let likeObject = {
          // some random id (implementation might be different from this one)
          "id": v4(),
          "userId": userStore.user?._id,
        };

        if (type === "deviceFeedbacks") {
          likeObject["device-feedbackId"] = comment.id;
        } else if (type === "deviceQuestions") {
          likeObject["device-questionId"] = comment.id;
        }

        const error = await DeviceCommentRatesActions.likeFeedback(likeObject, type, setIsAlreadyLiked, setIsChangingRate);
        // preventing redundant fetches if delete request failed
        if (!error) fetchingLikes();

        if (isAlreadyDisliked) {
          // we can't like and dislike a feedback at the same time
          await removeDislike();
        }
      }

    } else {
      await fetchingDislikes();
      const updatedDislikes = dislikesFetchResultRef.current;

      const updatedIsAlreadyDisliked = !!updatedDislikes?.find(dislike => dislike.userId === userStore.user?._id);
      if (updatedIsAlreadyDisliked !== isAlreadyDisliked) {
        setIsAlreadyDisliked(updatedIsAlreadyDisliked);
        if (updatedIsAlreadyDisliked && isAlreadyLiked) {
          await fetchingLikes();
          setIsAlreadyLiked(false);
        }

        return;
      };

      if (isAlreadyDisliked) {
        await removeDislike();
      } else {
        let dislikeObject = {
          "id": v4(),
          "userId": userStore.user?._id,
        };

        if (type === "deviceFeedbacks") {
          dislikeObject["device-feedbackId"] = comment.id;
        } else if (type === "deviceQuestions") {
          dislikeObject["device-questionId"] = comment.id;
        }

        const error = await DeviceCommentRatesActions.dislikeFeedback(dislikeObject, type, setIsAlreadyDisliked, setIsChangingRate);
        if (!error) fetchingDislikes();

        if (isAlreadyLiked) {
          await removeLike();
        }
      }

    }
  }

  let commentReplyWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyWord = "Answer";
  }

  const imagesObjs = [{
    commentId: comment.id,
    images: comment.images
  }];

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
      {type === "deviceFeedbacks"
        ? (
          <StarRating
            readOnlyValue={comment.rate}
            id={`${type}-${comment.id}-original-comment-rating`}
          />
        )
        : (type === "sellerFeedbacks") && (
          <SellerFeedbackStarRatings 
            serviceQualityVal={comment["service-quality-rate"]} 
            isUpToDateVal={comment["is-up-to-date-rate"]}
            deliverySpeedVal={comment["delivery-speed-rate"]}
            idStart={`${type}-${comment.id}`}
          />
        )
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
      {(!!comment.images.length && isWithImages) &&
        <CommentImagesSection imagesObjs={imagesObjs} type={type} />
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
