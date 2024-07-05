import "./styles/CommentModalContentInputs.css";
import { useEffect } from "react";
import StarRating from "./UI/starRating/StarRating";
import useWindowWidth from "../hooks/useWindowWidth";
import FilePickerSection from "./UI/filePicker/FilePickerSection";

const CommentModalContentInputs = ({ 
  type, register, errors, areInputsBlocked, errorsBeforeBlock, isToShowErrors, setIsToShowErrors, clearErrors, setError,
  settedStarRating, setSettedStarRating, isToShowStarError, setIsToShowStarError, openLoginModal,
  files, setFiles
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

  let starSize = 24;
  let isWithStarText = false;

  if (windowWidth >= 480) {
    starSize = 40;
    isWithStarText = true;
  } else if (windowWidth >= 380) {
    starSize = 32;
    isWithStarText = true;
  }

  return (
    <div className={inputsGroupClass}>
      {type === "feedback" &&
        <>
          <section className="comment-modal-content-rate-section">
            <h3>Rate device</h3>
            <StarRating
              id="comments-modal-content-star-rating"
              width={starSize}
              height={starSize}
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
          <div>
            <label>
              Advantages (optional)
              <input
                autoComplete="off"
                disabled={areInputsBlocked}
                className={
                  (!areInputsBlocked && errors?.advantages && isToShowErrors) ? "invalid" : ""
                }
                {...register("advantages", {
                  minLength: {
                    value: 3,
                    message: "This field must contain over than 3 characters"
                  },
                  maxLength: {
                    value: 1000,
                    message: "This field must contain less than 1000 characters"
                  }
                })}
              />
            </label>
            {(!areInputsBlocked && errors?.advantages && isToShowErrors) &&
              <p className="comment-modal-form-error-msg" aria-live="polite">
                {errors?.advantages?.message || "Error!"}
              </p>
            }
          </div>
          <div>
            <label>
              Disadvantages (optional)
              <input
                autoComplete="off"
                disabled={areInputsBlocked}
                className={
                  (!areInputsBlocked && errors?.disadvantages && isToShowErrors) ? "invalid" : ""
                }
                {...register("disadvantages", {
                  minLength: {
                    value: 3,
                    message: "This field must contain over than 3 characters"
                  },
                  maxLength: {
                    value: 1000,
                    message: "This field must contain less than 1000 characters"
                  }
                })}
              />
            </label>
            {(!areInputsBlocked && errors?.disadvantages && isToShowErrors) &&
              <p className="comment-modal-form-error-msg" aria-live="polite">
                {errors?.disadvantages?.message || "Error!"}
              </p>
            }
          </div>
        </>
      }
      <div>
        <label>
          Comment
          <textarea
            disabled={areInputsBlocked}
            className={
              (!areInputsBlocked && errors?.comment && isToShowErrors) ? "invalid" : ""
            }
            {...register("comment", {
              required: "This field is required",
              minLength: {
                value: 3,
                message: "This field must contain over than 3 characters"
              },
              maxLength: {
                value: 3000,
                message: "This field must contain less than 3000 characters"
              }
            })}
          />
        </label>
        {(!areInputsBlocked && errors?.comment && isToShowErrors) &&
          <p className="comment-modal-form-error-msg" aria-live="polite">
            {errors?.comment?.message || "Error!"}
          </p>
        }
      </div>
      {(type === "feedback" || type === "question") &&
        <FilePickerSection files={files} setFiles={setFiles} />
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
}

export default CommentModalContentInputs;
