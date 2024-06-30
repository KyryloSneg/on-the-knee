import "./styles/CommentModalBottomBtns.css";

const CommentModalBottomBtns = ({ type, setIsAnonymously, isAnonymously, closeModal, areErrors, areInputsBlocked }) => {
  let checkboxDivClass = "checkbox-div";
  if (isAnonymously) {
    checkboxDivClass += " checked";
  }

  return (
    <div className="comment-modal-bottom-btns">
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
      <div className="comment-modal-form-btn-group">
        <button
          className="comment-modal-form-deny-btn"
          onClick={closeModal}
        >
          Deny
        </button>
        <button
          className="comment-modal-form-submit-btn"
          type="submit"
          disabled={areErrors || areInputsBlocked}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentModalBottomBtns;
