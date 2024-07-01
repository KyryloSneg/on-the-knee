import "./styles/CommentModalContent.css";
import { useContext, useRef, useState } from "react";
import { Context } from "../Context";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import CommentModalContentInputs from "./CommentModalContentInputs";
import CommentModalBottomBtns from "./CommentModalBottomBtns";

const POSSIBLE_TYPES = ["feedback", "reply", "question", "answer"];
const CommentModalContent = observer(({ type, closeModal }) => {
  const { user } = useContext(Context);
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

  async function onSubmit() {
    if (settedStarRating === 0) {
      setIsToShowStarError(true);
      return;
    }
    // react-form-hook doesn't let this function run
    // if there are any errors but i put errors 
    // in the condition below just in case
    if (areErrors || areInputsBlocked) return;

    // closeModal();
  }

  const areErrors = !!Object.keys(errors).length;
  const areInputsBlocked = !user.isAuth && !isAnonymously;

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
