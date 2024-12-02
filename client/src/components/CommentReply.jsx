import "./styles/CommentReply.css";
import { useCallback, useContext, useRef, useState } from "react";
import useGettingOneUser from "../hooks/useGettingOneUser";
import getDateStr from "../utils/getDateStr";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import useLodashThrottle from "hooks/useLodashThrottle";
import deleteCommentLogic from "utils/deleteCommentLogic";
import UIOptions from "./UI/uiOptions/UIOptions";
import CommentModalContent from "./CommentModalContent";
import getDatetime from "utils/getDatetime";

const CommentReply = observer(({ 
  reply, type, seller, deviceId, isInModal, updateDeviceFeedbacksCb, deviceQuestionsFetching, areUserFeedbacks
}) => {
  const { app, user: userStore } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);

  // null means "no user", undefined means "user is needed to be set"
  const [user, setUser] = useState((!!reply?.user || reply?.user === null) ? reply?.user : undefined);
  const isToFetchUser = !user && user !== null && (reply.userId !== null && reply.userId !== undefined);
  
  useGettingOneUser(reply?.userId, setUser, true, isToFetchUser);

  const optionsBtnRef = useRef(null);
  const isAlreadyDeletingReply = useRef(false);

  const isYourComment = (userStore.user?.id === user?.id && !!user);

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, deleting the reply has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "comment-reply-error", className: "" });
    app.setErrorModalBtnRef(optionsBtnRef);
    
    setErrorModalVisibility(true, app);
  }, [app]);

  const deleteReply = useCallback(async () => {
    try {
      if (isAlreadyDeletingReply.current) return;
      isAlreadyDeletingReply.current = true

      await deleteCommentLogic(
        reply.id, deviceId, type, "reply", updateDeviceFeedbacksCb, 
        deviceQuestionsFetching, null, areUserFeedbacks
      );

      await updateDeviceFeedbacksCb();
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadyDeletingReply.current = false;
    }
  }, [
    reply, deviceId, type, openErrorModal, updateDeviceFeedbacksCb, deviceQuestionsFetching, areUserFeedbacks 
  ]);

  const throttledDeleteReply = useLodashThrottle(deleteReply, 500, { "trailing": false });

  const createdAtDate = new Date(reply.date);
  const createdAtDateStr = getDateStr(createdAtDate);
  const createdAtDatetime = getDatetime(createdAtDate);

  let commentReplyLabelWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyLabelWord = "Answer";
  }

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
      onClick: throttledDeleteReply,
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      )
    };

    optionsContent.push(deleteCommentOption);
  }

  let editCommentModalType;
  if (type === "deviceFeedbacks") {
    editCommentModalType = "reply";
  } else if (type === "deviceQuestions") {
    editCommentModalType = "answer";
  }

  let sectionClassName = "comment-item comment-reply";
  if (optionsContent.length) {
    sectionClassName += " with-options";
  }

  return (
    <section className={sectionClassName}>
      <div className="comment-content-wrap">
        <div className="comment-username-date-wrap">
          <div>
            <p className="comment-reply-reply-p">
              {commentReplyLabelWord}
            </p>
            <p className="comment-username">
              {isSellerOrSellerManager
                ? <>Manager of <span className="comment-seller-name">{seller?.name || "..."}</span> seller</>
                : isWithName ? `${user.name} ${user.surname}` : "..."
              }
            </p>
          </div>
          <time dateTime={createdAtDatetime} className="comment-date">
            {createdAtDateStr}
          </time>
        </div>
        {isEditing
          ? type !== "sellerFeedbacks" && (
              <CommentModalContent
                type={editCommentModalType}
                setIsEditing={setIsEditing}
                isEditCommentForm={true}
                comment={reply}
                propsDeviceId={deviceId}
                areUserFeedbacks={areUserFeedbacks}
              />
            )
          : (
            <div className="comment-msg-wrap">
              {reply.isEdited && <p className="comment-edited-msg">(Edited)</p>}
              <p>
                {reply.message}
              </p>
            </div>
          )
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

export default CommentReply;
