import "./styles/CommentModalBottomBtns.css";
import UIButton from "./UI/uiButton/UIButton";

const CommentModalBottomBtns = ({ type, setIsAnonymously, isAnonymously, closeModal, areErrors, areInputsBlocked }) => {
  let checkboxDivClass = "checkbox-div";
  if (isAnonymously) {
    checkboxDivClass += " checked";
  }

  return (
    <div className="comment-modal-bottom-btns">
      {(type === "feedback" || type === "question") &&
        <button
          className="comment-modal-is-anonymously"
          onClick={() => setIsAnonymously(!isAnonymously)}
          type="button"
          role="checkbox"
          aria-checked={isAnonymously}
        >
          <div className={checkboxDivClass} />
          Send {type} anonymously
        </button>
      }
      <div className="comment-modal-form-btn-group">
        <UIButton
          variant="modal-deny"
          className="comment-modal-form-deny-btn"
          onClick={closeModal}
        >
          Deny
        </UIButton>
        <UIButton
          variant="modal-submit"
          className="comment-modal-form-submit-btn"
          type="submit"
          disabled={areErrors || areInputsBlocked}
        >
          Submit
        </UIButton>
      </div>
    </div>
  );
}

export default CommentModalBottomBtns;
