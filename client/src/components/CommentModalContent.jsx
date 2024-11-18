import "./styles/CommentModalContent.css";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "../Context";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import CommentModalContentInputs from "./CommentModalContentInputs";
import CommentModalBottomBtns from "./CommentModalBottomBtns";
import { v4 } from "uuid";
import { createDeviceFeedback, createDeviceFeedbackReply, patchDeviceFeedback, patchDeviceFeedbackReply } from "../http/FeedbacksAPI";
import { createDeviceAnswer, createDeviceQuestion, patchDeviceAnswer, patchDeviceQuestion } from "../http/DeviceQuestionsAPI";
import { createSellerQuestion } from "../http/SellerQuestionsAPI";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";
import FileActions from "../utils/FileActions";
import useOneDeviceFeedbacksFetching from "hooks/useOneDeviceFeedbacksFetching";
import _ from "lodash";
import useLodashThrottle from "hooks/useLodashThrottle";
import setErrorModalVisibility from "utils/setErrorModalVisibility";

const POSSIBLE_TYPES = ["feedback", "reply", "question", "answer", "askSeller"];

// we use propsDeviceId if we can't reach it from the comment
const CommentModalContent = observer(({ 
  type, closeModal = null, setIsEditing = null, isEditCommentForm = false, comment = null, propsDeviceId = null
}) => {
  const { deviceStore, user, app } = useContext(Context);
  const [isToShowErrors, setIsToShowErrors] = useState(true);
  const [isAnonymously, setIsAnonymously] = useState(false);
  const [settedStarRating, setSettedStarRating] = useState(comment?.rate || 0);
  const [isToShowStarError, setIsToShowStarError] = useState(false);
  const [isToShowSellerCantRemainComment, setIsToShowSellerCantRemainComment] = useState(false);

  const filesFromComment = useMemo(() => comment?.images?.map(image => {
    let result = image instanceof File ? image.fileObj : FileActions.getFileFromBase64(image.fileObj);

    let imageCopy = _.cloneDeep(image);
    imageCopy.fileObj = result;

    return imageCopy;
  }), [comment?.images]);

  const [files, setFiles] = useState(filesFromComment || []);
  const errorsBeforeBlock = useRef({});

  const isAlreadySubmittingRef = useRef(false);
  const submitBtnRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceId = propsDeviceId || (isEditCommentForm ? comment?.deviceId : deviceStore.selectedDeviceId);
  const deviceFeedbacksFetching = useOneDeviceFeedbacksFetching(
    deviceId, null, null, true, true, false, app.commentModalGetCommentsQueryParamsStr
  );

  const deviceQuestionsFetching = useOneDeviceFeedbacksFetching(
    deviceId, null, null, true, false, true, app.commentModalGetCommentsQueryParamsStr
  );

  const isUserASellerOrManager = user.user?.roles?.includes("SELLER") || user.user?.roles?.includes("SELLER-MANAGER");

  useEffect(() => {
    if (!isUserASellerOrManager && !isEditCommentForm) setIsToShowSellerCantRemainComment(false);
  }, [isUserASellerOrManager, isEditCommentForm]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      advantages: comment?.advantages || "",
      disadvantages: comment?.disadvantages || "",
      comment: comment?.message || ""
    }
  });

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comment Modal Content is not defined or incorrect");

  // pass ref into arguments of the function instead of passing it as a prop below in the tree
  // because it's preety weird to use set ref only for a small button in the big component
  function openLoginModal() {
    closeModal?.();

    let ref = null;
    if (type === "feedback") {
      ref = app.deviceFeedbackModalBtnRef;
    } else if (type === "question") {
      ref = app.questionCommentModalBtnRef;
    }

    app.setAuthentificationModalBtnRef(ref);
    setAuthentificationModalVisibility(true, app);
  }

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, {isEditCommentForm ? "editing the comment" : "creating the comment"} has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "comment-modal-submit-error", className: "" });
    app.setErrorModalBtnRef(submitBtnRef);
    app.setIsToFocusErrorModalPrevModalTriggerElem(isEditCommentForm);

    setErrorModalVisibility(true, app);
  }, [app, isEditCommentForm]);

  const submitCallback = useCallback(async data => {
    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsSubmitting(true);

      const id = v4();
      const date = new Date().toISOString();
  
      // unfortunately we can't post data into json-server like FormData, 
      // so we base64 encode our files to send them in the request with json body
      const transformedFiles = await Promise.all(
        files.map(file => FileActions.getBase64(file.fileObj))
      );
  
      const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));
      if (isEditCommentForm) {
        const areEditedValuesAreTheSameAsBefore = (
          isEditCommentForm
            ? (
              data.advantages?.trim() === (comment?.advantages?.trim() || "")
              && data.disadvantages?.trim() === (comment?.disadvantages?.trim() || "")
              && data.comment.trim() === comment.message.trim()
              && settedStarRating === (comment?.rate || 0)
              && _.isEqual(files, filesFromComment || [])
            )
            : false
        );

        if (!areEditedValuesAreTheSameAsBefore) {
          if (type === "feedback") {
            let feedbackFieldsToUpdate = {};
    
            if (!_.isEqual(filesFromComment || [], files)) feedbackFieldsToUpdate.images = filesToSend;
            if (comment.message.trim() !== data.comment.trim()) feedbackFieldsToUpdate.message = data.comment.trim();
            if (comment.advantages?.trim() !== data.advantages?.trim()) feedbackFieldsToUpdate.advantages = data.advantages?.trim() || null;
            if (comment.disadvantages?.trim() !== data.disadvantages?.trim()) {
              feedbackFieldsToUpdate.disadvantages = data.disadvantages?.trim() || null;
            }
            if (comment.rate !== settedStarRating) feedbackFieldsToUpdate.rate = settedStarRating;
    
            if (Object.keys(feedbackFieldsToUpdate).length) {
              if (!comment.isEdited) feedbackFieldsToUpdate.isEdited = true;

              await patchDeviceFeedback(comment.id, feedbackFieldsToUpdate);
              await deviceFeedbacksFetching();
            }
          } else if (type === "reply") {
            let replyFieldsToUpdate = {};
            if (comment.message !== data.comment?.trim()) replyFieldsToUpdate.message = data.comment.trim();
    
            if (Object.keys(replyFieldsToUpdate).length) {
              if (!comment.isEdited) replyFieldsToUpdate.isEdited = true;

              await patchDeviceFeedbackReply(comment.id, replyFieldsToUpdate);
              await deviceFeedbacksFetching();
            }
          } else if (type === "question") {
            let questionFieldsToUpdate = {};
    
            if (!_.isEqual(filesFromComment || [], files)) questionFieldsToUpdate.images = filesToSend;
            if (comment.message !== data.comment.trim()) questionFieldsToUpdate.message = data.comment.trim();
    
            if (Object.keys(questionFieldsToUpdate).length) {
              if (!comment.isEdited) questionFieldsToUpdate.isEdited = true;

              await patchDeviceQuestion(comment.id, questionFieldsToUpdate);
              await deviceQuestionsFetching();
            }
          } else if (type === "answer") {
            let answerFieldsToUpdate = {};
            if (comment.message !== data.comment.trim()) answerFieldsToUpdate.message = data.comment.trim();
    
            if (Object.keys(answerFieldsToUpdate).length) {
              if (!comment.isEdited) answerFieldsToUpdate.isEdited = true;

              await patchDeviceAnswer(comment.id, answerFieldsToUpdate);
              await deviceQuestionsFetching();
            }
          }
        }
      } else {
        if (type === "feedback") {
          if (isUserASellerOrManager) {
            setIsToShowSellerCantRemainComment(true);
            return;
          }
    
          const newFeedback = {
            "id": id,
            "deviceId": deviceStore.selectedDeviceId,
            "userId": user.isAuth ? user.user.id : null,
            "isAnonymously": isAnonymously,
            "images": filesToSend,
            "message": data.comment.trim(),
            "advantages": data.advantages || null,
            "disadvantages": data.disadvantages || null,
            "rate": settedStarRating,
            "date": date,
            "isEdited": false,
          };
    
          await createDeviceFeedback(newFeedback);
          await deviceFeedbacksFetching();
        } else if (type === "reply") {
          const newReply = {
            "id": id,
            "device-feedbackId": deviceStore.selectedDeviceFeedbackId,
            "userId": user.user.id,
            "message": data.comment.trim(),
            "date": date,
            "isEdited": false,
          };
    
          await createDeviceFeedbackReply(newReply);
          await deviceFeedbacksFetching();
        } else if (type === "question") {
          if (isUserASellerOrManager) {
            setIsToShowSellerCantRemainComment(true);
            return;
          }
          
          const newQuestion = {
            "id": id,
            "deviceId": deviceStore.selectedDeviceId,
            "userId": user.isAuth ? user.user.id : null,
            "isAnonymously": isAnonymously,
            "images": filesToSend,
            "message": data.comment.trim(),
            "date": date,
            "isEdited": false,
          };
    
          await createDeviceQuestion(newQuestion);
          await deviceQuestionsFetching();
        } else if (type === "answer") {
          const newAnswer = {
            "id": id,
            "device-questionId": deviceStore.selectedDeviceQuestionId,
            "userId": user.user.id,
            "message": data.comment.trim(),
            "date": date,
            "isEdited": false,
          };
    
          await createDeviceAnswer(newAnswer);
          await deviceQuestionsFetching();
        } else if (type === "askSeller") {
          if (isUserASellerOrManager) {
            setIsToShowSellerCantRemainComment(true);
            return;
          }
    
          const newQuestion = {
            "id": id,
            "sellerId": deviceStore.selectedSellerId,
            "userId": user.isAuth ? user.user.id : null,
            "message": data.comment.trim(),
            "date": date,
          };
    
          await createSellerQuestion(newQuestion);
        }
      }
  
      closeModal?.();
      setIsEditing?.(false);
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    closeModal, comment, deviceFeedbacksFetching,
    deviceQuestionsFetching, deviceStore.selectedDeviceFeedbackId, deviceStore.selectedDeviceQuestionId,
    deviceStore.selectedSellerId, deviceStore.selectedDeviceId, files, 
    isAnonymously, isEditCommentForm, isUserASellerOrManager, openErrorModal, 
    setIsEditing, settedStarRating, type, user.isAuth, user.user?.id, filesFromComment
  ]);

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  function onSubmit(data) {
    if (type === "feedback" && settedStarRating === 0) {
      setIsToShowStarError(true);
      return;
    }
    
    // react-form-hook doesn't let this function run
    // if there are any errors but i put errors 
    // in the condition below just in case
    if (areErrors || areInputsBlocked) return;
    throttledSubmitCallback(data);
  }

  const areErrors = !!Object.keys(errors).length || isToShowStarError;
  const areInputsBlocked = !user.isAuth && (
    (type === "feedback" || type === "question") 
    ? !isAnonymously
    : false
  );

  let sectionClassName = "comment-modal-content";
  if (isEditCommentForm) {
    sectionClassName += " editing-comment-version";
  }

  return (
    <section className={sectionClassName}>
      <form className="comment-modal-form" onSubmit={handleSubmit(onSubmit)}>
        <CommentModalContentInputs 
          type={type}
          register={register}
          errors={errors}
          areInputsBlocked={areInputsBlocked}
          errorsBeforeBlock={errorsBeforeBlock}
          isToShowErrors={isToShowErrors}
          setIsToShowErrors={setIsToShowErrors}
          clearErrors={clearErrors}
          setError={setError}
          settedStarRating={settedStarRating}
          setSettedStarRating={setSettedStarRating}
          isToShowStarError={isToShowStarError}
          setIsToShowStarError={setIsToShowStarError}
          openLoginModal={openLoginModal}
          files={files}
          setFiles={setFiles}
          isEditCommentForm={isEditCommentForm}
        />
        <CommentModalBottomBtns 
          type={type}
          setIsAnonymously={setIsAnonymously}
          isAnonymously={isAnonymously}
          closeModal={closeModal}
          setIsEditing={setIsEditing}
          isEditCommentForm={isEditCommentForm}
          areErrors={areErrors}
          areInputsBlocked={areInputsBlocked}
          isToShowSellerCantRemainComment={isToShowSellerCantRemainComment}
          isSubmitting={isSubmitting}
          ref={submitBtnRef}
        />
      </form>
    </section>
  );
});

export default CommentModalContent;
