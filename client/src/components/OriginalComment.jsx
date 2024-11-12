import "./styles/OriginalComment.css";
import CommentImagesSection from "./CommentImagesSection";
import replyIcon from "../assets/reply_24x24_7373FF.svg";
import filledLikeIcon from "../assets/thumb_up_24x24_filled_3348E6.svg";
import notFilledLikeIcon from "../assets/thumb_up_24x24_not-filled_3348E6.svg";
import filledDislikeIcon from "../assets/thumb_down_24x24_filled_3348E6.svg";
import notFilledDislikeIcon from "../assets/thumb_down_24x24_not-filled_3348E6.svg";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import DeviceCommentRatesActions from "../utils/DeviceCommentRatesActions";
import useFetchingDeviceCommentRates from "../hooks/useFetchingDeviceCommentRates";
import { v4 } from "uuid";
import setReplyModalVisibility from "../utils/setReplyModalVisibility";
import StarRating from "./UI/starRating/StarRating";
import setAnswerModalVisibility from "../utils/setAnswerModalVisibility";
import SellerFeedbackStarRatings from "./SellerFeedbackStarRatings";
import UIButton from "./UI/uiButton/UIButton";
import getDateStr from "../utils/getDateStr";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";
import useLodashThrottle from "hooks/useLodashThrottle";
import setErrorModalVisibility from "utils/setErrorModalVisibility";

const OriginalComment = observer(({ 
  comment, user, seller, type, singularCommentWord = "comment", isWithImages, closeGalleryModal 
}) => {
  const { user: userStore, app, deviceStore } = useContext(Context);
  
  const isGalleryModal = !!closeGalleryModal;
  
  const replyBtnRef = useRef(null);
  const likeBtnRef = useRef(null);
  const dislikeBtnRef = useRef(null);
  const isAlreadyChangingRate = useRef(false);

  // we must update likes and dislikes after user clicks on one of them
  const [likes, setLikes] = useState(comment["device-feedback-likes"] || comment["device-question-likes"]);
  const [dislikes, setDislikes] = useState(comment["device-feedback-dislikes"] || comment["device-question-dislikes"]);

  const {
    fetchingLikes,
    fetchingDislikes,
  } = useFetchingDeviceCommentRates(comment.id, setLikes, setDislikes, type);

  const createdAtDate = new Date(comment.date);
  const createdAtDateStr = getDateStr(createdAtDate);

  let likeFromUser;
  let dislikeFromUser;

  likeFromUser = likes?.find(like => like.userId === userStore.user?.id);
  dislikeFromUser = dislikes?.find(dislike => dislike.userId === userStore.user?.id);

  const [isChangingRate, setIsChangingRate] = useState({ isLiking: false, isDisliking: false });
  const [isCantRateYourCommentError, setIsCantRateYourCommentError] = useState(false)

  const isYourComment = (userStore.user?.id === user?.id && !!user);

  useEffect(() => {
    // if user have closed the gallery modal or have opened one, update likes and dislikes
    if (
      (!isGalleryModal && !app.isVisibleCommentGalleryModal)
      || (isGalleryModal && app.isVisibleCommentGalleryModal)
    ) {
      fetchingLikes();
      fetchingDislikes();
    };
  }, [app.isVisibleCommentGalleryModal, fetchingLikes, fetchingDislikes, isGalleryModal]);

  function reply() {
    deviceStore.setSelectedDeviceId(comment.deviceId);

    if (type === "deviceFeedbacks") {
      deviceStore.setSelectedDeviceFeedbackId(comment.id);
      app.setReplyModalBtnRef(replyBtnRef);

      setReplyModalVisibility(true, app, isGalleryModal);
    } else if (type === "deviceQuestions") {
      deviceStore.setSelectedDeviceQuestionId(comment.id);
      app.setAnswerModalBtnRef(replyBtnRef);

      setAnswerModalVisibility(true, app, isGalleryModal);
    }

    if (isGalleryModal) closeGalleryModal();
  }

  const openErrorModal = useCallback(isLike => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, rating the comment has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "change-comment-rate-error", className: "" });
    app.setErrorModalBtnRef(isLike ? likeBtnRef : dislikeBtnRef);
    app.setIsToFocusErrorModalPrevModalTriggerElem(false);

    setErrorModalVisibility(true, app);
  }, [app]);

  const removeLike = useCallback(async () => {
    // adding this condition just in case
    // (rateComment fn is already doing this)
    if (!userStore.isAuth) {
      // open user login modal
      app.setAuthentificationModalBtnRef(likeBtnRef);
      setAuthentificationModalVisibility(true, app);
      return;
    };

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    await DeviceCommentRatesActions.removeLikeRate(likeFromUser.id, type, true);
    await fetchingLikes();
  }, [
    app, fetchingLikes, isCantRateYourCommentError, 
    isYourComment, likeFromUser?.id, type, userStore.isAuth
  ]);

  const removeDislike = useCallback(async () => {
    // once more adding this condition just in case
    // (rateComment fn is already doing this)
    if (!userStore.isAuth) {
      // open user login modal
      app.setAuthentificationModalBtnRef(dislikeBtnRef);
      setAuthentificationModalVisibility(true, app);
      return;
    };

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    await DeviceCommentRatesActions.removeDislikeRate(dislikeFromUser.id, type, true);
    await fetchingDislikes();
  }, [
    app, dislikeFromUser?.id, fetchingDislikes, 
    isCantRateYourCommentError, isYourComment, type, userStore.isAuth
  ]);

  const rateComment = useCallback(async isLike => {
    if (!userStore.isAuth) {
      // open user login modal
      app.setAuthentificationModalBtnRef(isLike ? likeBtnRef : dislikeBtnRef);
      setAuthentificationModalVisibility(true, app);
      return;
    };

    // we can't like and dislike a comment at the same time
    if (isAlreadyChangingRate.current) return;
    isAlreadyChangingRate.current = true

    if (isYourComment) {
      if (!isCantRateYourCommentError) setIsCantRateYourCommentError(true);
      isAlreadyChangingRate.current = false;

      return;
    } else {
      if (isCantRateYourCommentError) setIsCantRateYourCommentError(false);
    }

    try {
      setIsChangingRate({ isLiking: isLike, isDisliking: !isLike });
    
      if (isLike) {
        if (!!likeFromUser) {
          await removeLike();
        } else {
          let likeObject = {
            "id": v4(),
            "userId": userStore.user?.id,
          };
  
          if (type === "deviceFeedbacks") {
            likeObject["device-feedbackId"] = comment.id;
          } else if (type === "deviceQuestions") {
            likeObject["device-questionId"] = comment.id;
          }
  
          await DeviceCommentRatesActions.likeFeedback(likeObject, type, null, true);
          await fetchingLikes();
  
          if (!!dislikeFromUser) {
            // we can't like and dislike a feedback at the same time
            await removeDislike();
          }
        }
      } else {
        if (!!dislikeFromUser) {
          await removeDislike();
        } else {
          let dislikeObject = {
            "id": v4(),
            "userId": userStore.user?.id,
          };
  
          if (type === "deviceFeedbacks") {
            dislikeObject["device-feedbackId"] = comment.id;
          } else if (type === "deviceQuestions") {
            dislikeObject["device-questionId"] = comment.id;
          }
  
          await DeviceCommentRatesActions.dislikeFeedback(dislikeObject, type, null, true);
          await fetchingDislikes();
  
          if (!!likeFromUser) {
            await removeLike();
          }
        }
      }
    } catch (e) {
      openErrorModal(isLike);
    } finally {
      isAlreadyChangingRate.current = false;
      setIsChangingRate({ isLiking: false, isDisliking: false });
    }
  }, [
    app, comment.id, fetchingDislikes, isCantRateYourCommentError,
    fetchingLikes, type, userStore.isAuth, userStore.user?.id, openErrorModal,
    isYourComment, likeFromUser, dislikeFromUser, removeDislike, removeLike
  ]);

  const throttledRateComment = useLodashThrottle(rateComment, 50, { "trailing": false });

  let commentReplyWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyWord = "Answer";
  }

  const imagesObjs = [{
    commentId: comment.id,
    images: comment.images
  }];

  const isWithName = user?.name && user?.surname;
  const isSellerOrSellerManager = user?.roles?.includes("SELLER") || user?.roles?.includes("SELLER-MANAGER");

  return (
    <section className="original-comment">
      <div className="comment-username-date-wrap">
        <p className="comment-username">
          {isSellerOrSellerManager
            ? <>Manager of <span className="comment-seller-name">{seller?.name || "..."}</span> seller</>
            : comment?.isAnonymously
              ? 
                user
                  ? `Anonym (You)`
                  : "Anonym"
              : isWithName ? `${user.name} ${user.surname}` : "..."
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
          <UIButton
            variant="primary2"
            className="original-comment-reply-btn"
            onClick={reply}
            ref={replyBtnRef}
          >
            <img src={replyIcon} alt="" draggable="false" />
            {commentReplyWord}
          </UIButton>
          <div className="original-comment-rate-group-error-wrap">
            <div className="original-comment-rate-btn-group">
              <button
                onClick={() => throttledRateComment(true)}
                aria-label={
                  !!likeFromUser
                    ? `Remove your like from the ${singularCommentWord}`
                    : `Like the ${singularCommentWord}`
                }
                disabled={isChangingRate.isLiking || isChangingRate.isDisliking}
                ref={likeBtnRef}
              >
                {!!likeFromUser
                  ? <img src={filledLikeIcon} alt="Remove like" draggable="false" />
                  : <img src={notFilledLikeIcon} alt="Like" />
                }
                <span>{likes?.length}</span>
              </button>
              <button
                onClick={() => throttledRateComment(false)}
                aria-label={
                  !!dislikeFromUser
                    ? `Remove your dislike from the ${singularCommentWord}`
                    : `Dislike the ${singularCommentWord}`
                }
                disabled={isChangingRate.isLiking || isChangingRate.isDisliking}
                ref={dislikeBtnRef}
              >
                {!!dislikeFromUser
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
