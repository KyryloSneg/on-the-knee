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
import UIOptions from "./UI/uiOptions/UIOptions";
import deleteCommentLogic from "utils/deleteCommentLogic";
import CommentModalContent from "./CommentModalContent";
import WriteSellerFeedbackForm from "./WriteSellerFeedbackForm";
import useGettingOneUser from "hooks/useGettingOneUser";
import getDatetime from "utils/getDatetime";

const OriginalComment = observer(({
  comment, type, seller, singularCommentWord = "comment", isWithImages, closeGalleryModal, closeRemainAFeedbackModal, 
  isInModal, deviceQuestionsFetching, areUserFeedbacks, updateDeviceFeedbacksCb, updateSellerFeedbacksCb
}) => {
  const { user: userStore, app, deviceStore, fetchRefStore } = useContext(Context);

  const isGalleryModal = !!closeGalleryModal;
  const isRemainAFeedbackModal = !!closeRemainAFeedbackModal;

  const replyBtnRef = useRef(null);
  const likeBtnRef = useRef(null);
  const dislikeBtnRef = useRef(null);
  const optionsBtnRef = useRef(null);

  const isAlreadyChangingRate = useRef(false);
  const isAlreadyDeletingComment = useRef(false);

  const [isEditing, setIsEditing] = useState(false);

  // null means "no user", undefined means "user is needed to be set"
  const [user, setUser] = useState((!!comment?.user || comment?.user === null) ? comment?.user : undefined);
  const isToFetchUser = !user && user !== null && (comment.userId !== null && comment.userId !== undefined);
  
  useGettingOneUser(comment?.userId, setUser, true, isToFetchUser);

  // we must update likes and dislikes after user clicks on one of them
  const [likes, setLikes] = useState(comment["device-feedback-likes"] || comment["device-question-likes"]);
  const [dislikes, setDislikes] = useState(comment["device-feedback-dislikes"] || comment["device-question-dislikes"]);

  const {
    fetchingLikes,
    fetchingDislikes,
  } = useFetchingDeviceCommentRates(comment.id, setLikes, setDislikes, type);

  const createdAtDate = new Date(comment.date);
  const createdAtDateStr = getDateStr(createdAtDate);
  const createdAtDatetime = getDatetime(createdAtDate);

  let likeFromUser;
  let dislikeFromUser;

  likeFromUser = likes?.find(like => like.userId === userStore.user?.id);
  dislikeFromUser = dislikes?.find(dislike => dislike.userId === userStore.user?.id);

  const [isChangingRate, setIsChangingRate] = useState(false);
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
      app.setCommentModalContentAreUserFeedbacks(areUserFeedbacks || fetchRefStore.hasAlreadyFetchedUserDevsFeedbacks);
      app.setReplyModalBtnRef(replyBtnRef);

      setReplyModalVisibility(true, app, isGalleryModal || isRemainAFeedbackModal);
    } else if (type === "deviceQuestions") {
      deviceStore.setSelectedDeviceQuestionId(comment.id);
      app.setAnswerModalBtnRef(replyBtnRef);

      setAnswerModalVisibility(true, app, isGalleryModal);
    }

    if (isGalleryModal) closeGalleryModal();
    if (closeRemainAFeedbackModal) closeRemainAFeedbackModal();
  }

  const openErrorModal = useCallback((errorType, btnRef) => {
    let errorMsgPart = "";
    if (errorType === "rate") {
      errorMsgPart = "rating the comment";
    } else if (errorType === "deleteComment") {
      errorMsgPart = "deleting the comment";
    }

    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, {errorMsgPart} has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "original-comment-error", className: "" });
    app.setErrorModalBtnRef(btnRef);
    
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
      setIsChangingRate(true);

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
      openErrorModal("rate", isLike ? likeBtnRef : dislikeBtnRef);
    } finally {
      isAlreadyChangingRate.current = false;
      setIsChangingRate(false);
    }
  }, [
    app, comment.id, fetchingDislikes, isCantRateYourCommentError,
    fetchingLikes, type, userStore.isAuth, userStore.user?.id, openErrorModal,
    isYourComment, likeFromUser, dislikeFromUser, removeDislike, removeLike
  ]);

  const throttledRateComment = useLodashThrottle(rateComment, 50, { "trailing": false });

  const deleteComment = useCallback(async () => {
    try {
      if (isAlreadyDeletingComment.current) return;
      isAlreadyDeletingComment.current = true

      let deviceOrSellerId;
      if (type === "deviceFeedbacks") {
        deviceOrSellerId = comment.deviceId;
      } else if (type === "sellerFeedbacks") {
        deviceOrSellerId = comment.sellerId;
      }

      await deleteCommentLogic(
        comment.id, deviceOrSellerId, type, "comment", updateDeviceFeedbacksCb, 
        deviceQuestionsFetching, updateSellerFeedbacksCb, areUserFeedbacks
      );
      

      // updateAlreadyFetchedDeviceFeedbacks();
    } catch (e) {
      openErrorModal("deleteComment", optionsBtnRef);
    } finally {
      isAlreadyDeletingComment.current = false;
    }
    // eslint-disable-next-line
  }, [
    comment.id, type, openErrorModal, areUserFeedbacks,
    comment.deviceId, comment?.sellerId, deviceStore.devicesFeedbacks, deviceStore.sellersFeedbacks,
    fetchRefStore.lastDevicePageDeviceIdWithFetchedComments, deviceQuestionsFetching, 
    updateDeviceFeedbacksCb, updateSellerFeedbacksCb, deviceStore
  ]);

  const throttledDeleteComment = useLodashThrottle(deleteComment, 500, { "trailing": false });

  let commentReplyWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyWord = "Answer";
  }

  const imagesObjs = [{
    commentId: comment.id,
    images: comment.images
  }];

  const isWithName = user?.name && user?.surname;
  // if i was using the real server, it would also check is the user the seller of THIS device
  const isSellerOrSellerManager = user?.roles?.includes("SELLER") || user?.roles?.includes("SELLER-MANAGER");

  let optionsContent = [];
  if (!isInModal && (isYourComment || isSellerOrSellerManager)) {
    if (isYourComment) {
      const editCommentOption = {
        name: "Edit",
        onClick: () => setIsEditing(true),
        svgIcon: (
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
          </svg>
        )
      };

      optionsContent.push(editCommentOption);
    }

    const deleteCommentOption = {
      name: "Delete",
      onClick: throttledDeleteComment,
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      )
    };

    optionsContent.push(deleteCommentOption);
  }

  let sectionClassName = "comment-item";
  if (optionsContent.length) {
    sectionClassName += " with-options";
  }

  let editDeviceCommentModalType;
  if (type === "deviceFeedbacks") {
    editDeviceCommentModalType = "feedback";
  } else if (type === "deviceQuestions") {
    editDeviceCommentModalType = "question";
  }

  return (
    <section className={sectionClassName}>
      <div className="comment-content-wrap">
        <div className="comment-username-date-wrap">
          <p className="comment-username">
            {comment?.isAnonymously
              ?
              user
                ? `Anonym (You)`
                : "Anonym"
              : isWithName ? `${user.name} ${user.surname}` : "..."
            }
          </p>
          <time dateTime={createdAtDatetime} className="comment-date">
            {createdAtDateStr}
          </time>
        </div>
        {isEditing
          ? type !== "sellerFeedbacks"
            ? (
              <CommentModalContent 
                type={editDeviceCommentModalType}
                setIsEditing={setIsEditing}
                isEditCommentForm={true}
                comment={comment}
                areUserFeedbacks={areUserFeedbacks}
              />
            )
            : (
              <WriteSellerFeedbackForm 
                sellerId={seller?.id} 
                sellerSlug={seller?.slug}   
                setIsEditing={setIsEditing}
                isEditCommentForm={true}  
                comment={comment}
                updateSellerFeedbacksCb={updateSellerFeedbacksCb}
                areUserFeedbacks={areUserFeedbacks}
              />
            )
          : (
            <>
              {type === "deviceFeedbacks"
                ? (
                  <StarRating
                    readOnlyValue={comment.rate}
                    id={`${type}-${comment.id}-original-comment-rating`}
                  />
                )
                : (type === "sellerFeedbacks") && (
                  <SellerFeedbackStarRatings
                    isUpToDateVal={comment["is-up-to-date-rate"]}
                    deliverySpeedVal={comment["delivery-speed-rate"]}
                    serviceQualityVal={comment["service-quality-rate"]}
                    idStart={`${type}-${comment.id}`}
                  />
                )
              }
              <div className="comment-msg-wrap">
                {comment.isEdited && <p className="comment-edited-msg">(Edited)</p>}
                {comment.message &&
                  <p className="original-comment-message">
                    {comment.message}
                  </p>
                }
              </div>
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
            </>
          )
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
                  disabled={isChangingRate}
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
                  disabled={isChangingRate}
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
      </div>
      {!!optionsContent.length && (
        <UIOptions
          optionsContent={optionsContent}
          isToAlwaysRemainBtn={true}
          ref={optionsBtnRef}
        />
      )}
    </section>
  );
});

export default OriginalComment;
