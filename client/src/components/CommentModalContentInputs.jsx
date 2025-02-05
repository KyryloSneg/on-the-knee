import "./styles/CommentModalContentInputs.css";
import { useEffect } from "react";
import StarRating from "./UI/starRating/StarRating";
import useWindowWidth from "../hooks/useWindowWidth";
import FilePickerSection from "./UI/filePicker/FilePickerSection";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { BASE_OPTIONS, REQUIRED_TEXTAREA_OPTIONS } from "../utils/inputOptionsConsts";
import ReactHookFormTextarea from "./UI/reactHookFormTextarea/ReactHookFormTextarea";

const CommentModalContentInputs = ({
  type, register, errors, areInputsBlocked, errorsBeforeBlock, isToShowErrors, setIsToShowErrors, clearErrors, setError,
  settedStarRating, setSettedStarRating, isToShowStarError, setIsToShowStarError, openLoginModal,
  files, setFiles, isEditCommentForm
}) => {
  const windowWidth = useWindowWidth();

  let inputsGroupClass = "comment-modal-form-inputs";
  if (areInputsBlocked) {
    inputsGroupClass += " transparent";
  }

  useEffect(() => {
    if (areInputsBlocked) {
      // while inputs are blocked user can still invoke new errors clicking on
      // the "Sign in first" button, so remember errors before a block and
      // restore them on unblocking the inputs 
      // (unfortunately i couldn't manage to block event handlers related to them)
      errorsBeforeBlock.current = { ...errors };
      setIsToShowErrors(false);
    } else {
      // clearing errors is mandatory
      clearErrors(["advantages", "disadvantages", "comment"]);
      for (let [key, value] of Object.entries(errorsBeforeBlock.current)) {
        setError(key, value);
      }

      setIsToShowErrors(true);
    }
    // eslint-disable-next-line
  }, [areInputsBlocked, clearErrors, setError]);

  const commentTextareaName = "comment"
  const commentRegisterResult = register(commentTextareaName, REQUIRED_TEXTAREA_OPTIONS);

  let starSize = 16;
  let isWithStarText = false;

  if (isEditCommentForm) {
    starSize = 20;

    if (windowWidth >= 700) {
      starSize = 40;
      isWithStarText = true;
    } else if (windowWidth >= 670) {
      starSize = 32;
      isWithStarText = true;
    } else if (windowWidth >= 320) {
      starSize = 24;
    }
  } else {
    starSize = 24;

    if (windowWidth >= 480) {
      starSize = 40;
      isWithStarText = true;
    } else if (windowWidth >= 380) {
      starSize = 32;
      isWithStarText = true;
    }
  }

  return (
    <div className={inputsGroupClass}>
      {type === "feedback" &&
        <>
          <section className="comment-modal-content-rate-section">
            <h3>Rate device</h3>
            <StarRating
              id="comments-modal-content-star-rating"
              size={starSize}
              isWithText={isWithStarText}
              isReadOnly={false}
              areBtnsBlocked={areInputsBlocked}
              settedValue={settedStarRating}
              setSettedValue={setSettedStarRating}
              onSetCb={() => setIsToShowStarError(false)}
            />
            {isToShowStarError &&
              <p className="comment-modal-form-error-msg" aria-live="polite">
                Required to rate the device
              </p>
            }
          </section>
          <ReactHookFormInput
            labelText="Advantages (optional)"
            inputName="advantages"
            errors={errors}
            registerFnResult={register("advantages", BASE_OPTIONS)}
            isDisabled={areInputsBlocked}
            isErrorCondition={!areInputsBlocked && errors?.advantages && isToShowErrors}
          />
          <ReactHookFormInput
            labelText="Disadvantages (optional)"
            inputName="disadvantages"
            errors={errors}
            registerFnResult={register("disadvantages", BASE_OPTIONS)}
            isDisabled={areInputsBlocked}
            isErrorCondition={!areInputsBlocked && errors?.disadvantages && isToShowErrors}
          />
        </>
      }
      <ReactHookFormTextarea 
        labelText="Comment"
        textareaName={commentTextareaName}
        errors={errors}
        registerFnResult={commentRegisterResult}
        isDisabled={areInputsBlocked}
        isErrorCondition={!areInputsBlocked && errors?.[commentTextareaName] && isToShowErrors}
      />
      {(type === "feedback" || type === "question") &&
        <FilePickerSection files={files} setFiles={setFiles} isDisabled={areInputsBlocked} />
      }
      {areInputsBlocked &&
        <div className="comment-modal-form-block">
          <button onClick={openLoginModal}>
            Sign in first to write a comment (or do it anonymously)
          </button>
        </div>
      }
    </div>
  );
};

export default CommentModalContentInputs;
