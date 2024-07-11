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

const POSSIBLE_TYPES = ["feedback", "reply", "question", "answer", "askSeller"];
const CommentModalContent = observer(({ type, closeModal }) => {
  const { app, user } = useContext(Context);
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

  function openLoginModal() {
    closeModal();
    // TODO: open the modal
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

    function getBase64(file) {
      const reader = new FileReader();

      return new Promise(resolve => {
        reader.onload = e => {
          resolve(e.target.result);
        }
        reader.readAsDataURL(file);
      })
    }

    // unfortunately we can't post data into json-server like FormData, 
    // so we base64 encode our files to send them in the request with json body
    const transformedFiles = await Promise.all(
      files.map(file => getBase64(file.fileObj))
    );

    const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));
    if (type === "feedback") {
      const newFeedback = {
        "id": id,
        "deviceId": app.selectedDeviceId,
        "userId": isAnonymously ? null : user.user?._id,
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
      const feedbacks = await getOneDeviceFeedbacks(app.selectedDeviceId);
      app.setDeviceFeedbacks(feedbacks);
    } else if (type === "reply") {
      const newReply = {
        "id": id,
        "device-feedbackId": app.selectedDeviceFeedbackId,
        "userId": user.user?._id || null,
        "message": data.comment,
        "date": date,
      };

      await createDeviceFeedbackReply(newReply);

      const feedbacks = await getOneDeviceFeedbacks(app.selectedDeviceId);
      app.setDeviceFeedbacks(feedbacks);
    } else if (type === "question") {
      const newQuestion = {
        "id": id,
        "deviceId": app.selectedDeviceId,
        "userId": isAnonymously ? null : user.user?._id,
        "isAnonymously": isAnonymously,
        "images": filesToSend,
        "message": data.comment,
        "date": date,
      };

      await createDeviceQuestion(newQuestion);

      // updating device's questions
      const questions = await getOneDeviceQuestions(app.selectedDeviceId);
      app.setDeviceQuestions(questions);
    } else if (type === "answer") {
      const newAnswer = {
        "id": id,
        "device-questionId": app.selectedDeviceQuestionId,
        "userId": user.user?._id || null,
        "message": data.comment,
        "date": date,
      };

      await createDeviceAnswer(newAnswer);

      const questions = await getOneDeviceQuestions(app.selectedDeviceId);
      app.setDeviceQuestions(questions);
    } else if (type === "askSeller") {
      const newQuestion = {
        "id": id,
        "sellerId": app.selectedSellerId,
        "userId": user.user?._id || null,
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
