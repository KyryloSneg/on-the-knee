import "./styles/CommentModalContent.css";
import { useContext, useRef, useState } from "react";
import { Context } from "../Context";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import CommentModalContentInputs from "./CommentModalContentInputs";
import CommentModalBottomBtns from "./CommentModalBottomBtns";
import { v4 } from "uuid";
import { createDeviceFeedback, createDeviceFeedbackReply, getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { createDeviceAnswer, createDeviceQuestion, getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";
import { createSellerQuestion } from "../http/SellerQuestionsAPI";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";
import FileActions from "../utils/FileActions";

const POSSIBLE_TYPES = ["feedback", "reply", "question", "answer", "askSeller"];
const CommentModalContent = observer(({ type, closeModal }) => {
  const { deviceStore, user, app } = useContext(Context);
  const [isToShowErrors, setIsToShowErrors] = useState(true);
  const [isAnonymously, setIsAnonymously] = useState(false);
  const [settedStarRating, setSettedStarRating] = useState(0);
  const [isToShowStarError, setIsToShowStarError] = useState(false);
  const [files, setFiles] = useState([]);
  const errorsBeforeBlock = useRef({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors
  } = useForm({
    mode: "onBlur"
  });

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comment Modal Content is not defined or incorrect");

  // pass ref into arguments of the function instead of passing it as a prop below in the tree
  // because it's preety weird to use set ref only for a small button in the big component
  function openLoginModal() {
    closeModal();

    let ref = null;
    if (type === "feedback") {
      ref = app.deviceFeedbackModalBtnRef;
    } else if (type === "question") {
      ref = app.questionCommentModalBtnRef;
    }

    app.setAuthentificationModalBtnRef(ref);
    setAuthentificationModalVisibility(true, app);
  }

  async function onSubmit(data) {
    if (type === "feedback" && settedStarRating === 0) {
      setIsToShowStarError(true);
      return;
    }
    // react-form-hook doesn't let this function run
    // if there are any errors but i put errors 
    // in the condition below just in case
    if (areErrors || areInputsBlocked) return;
    const id = v4();
    const date = new Date().toISOString();

    // unfortunately we can't post data into json-server like FormData, 
    // so we base64 encode our files to send them in the request with json body
    const transformedFiles = await Promise.all(
      files.map(file => FileActions.getBase64(file.fileObj))
    );

    const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));
    if (type === "feedback") {
      const newFeedback = {
        "id": id,
        "deviceId": deviceStore.selectedDeviceId,
        "userId": isAnonymously ? null : user.user?.id,
        "isAnonymously": isAnonymously,
        "images": filesToSend,
        "message": data.comment,
        "advantages": data.advantages || null,
        "disadvantages": data.disadvantages || null,
        "rate": settedStarRating,
        "date": date,
      };

      await createDeviceFeedback(newFeedback);

      // updating device's feedbacks
      const feedbacks = await getOneDeviceFeedbacks(deviceStore.selectedDeviceId, app.commentModalGetCommentsQueryParamsStr);
      deviceStore.setDevicesFeedbacks(feedbacks);
    } else if (type === "reply") {
      const newReply = {
        "id": id,
        "device-feedbackId": deviceStore.selectedDeviceFeedbackId,
        "userId": user.user?.id || null,
        "message": data.comment,
        "date": date,
      };

      await createDeviceFeedbackReply(newReply);

      const feedbacks = await getOneDeviceFeedbacks(deviceStore.selectedDeviceId, app.commentModalGetCommentsQueryParamsStr);
      deviceStore.setDevicesFeedbacks(feedbacks);
    } else if (type === "question") {
      const newQuestion = {
        "id": id,
        "deviceId": deviceStore.selectedDeviceId,
        "userId": isAnonymously ? null : user.user?.id,
        "isAnonymously": isAnonymously,
        "images": filesToSend,
        "message": data.comment,
        "date": date,
      };

      await createDeviceQuestion(newQuestion);

      // updating device's questions
      const questions = await getOneDeviceQuestions(deviceStore.selectedDeviceId, app.commentModalGetCommentsQueryParamsStr);
      deviceStore.setDeviceQuestions(questions);
    } else if (type === "answer") {
      const newAnswer = {
        "id": id,
        "device-questionId": deviceStore.selectedDeviceQuestionId,
        "userId": user.user?.id || null,
        "message": data.comment,
        "date": date,
      };

      await createDeviceAnswer(newAnswer);

      const questions = await getOneDeviceQuestions(deviceStore.selectedDeviceId, app.commentModalGetCommentsQueryParamsStr);
      deviceStore.setDeviceQuestions(questions);
    } else if (type === "askSeller") {
      const newQuestion = {
        "id": id,
        "sellerId": deviceStore.selectedSellerId,
        "userId": user.user?.id || null,
        "message": data.comment,
        "date": date,
      };

      await createSellerQuestion(newQuestion);
    }

    closeModal();
  }

  const areErrors = !!Object.keys(errors).length || isToShowStarError;
  const areInputsBlocked = !user.isAuth && (
    (type === "feedback" || type === "question") 
    ? !isAnonymously
    : false
  );

  return (
    <section className="comment-modal-content">
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
        />
        <CommentModalBottomBtns 
          type={type}
          setIsAnonymously={setIsAnonymously}
          isAnonymously={isAnonymously}
          closeModal={closeModal}
          areErrors={areErrors}
          areInputsBlocked={areInputsBlocked}
        />
      </form>
    </section>
  );
});

export default CommentModalContent;
