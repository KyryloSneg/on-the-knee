import "./DeleteInputContent.css";

const DeleteInputContent = ({ onClick, ...props }) => {
  return (
    <button
      type="button"
      className="delete-input-content-btn active"
      aria-label="Delete input content"
      onClick={onClick}
      {...props}
    >
      {/* writing svg into the component to style it easily */}
      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
        <path
          d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
      </svg>
    </button>
  );
}

export default DeleteInputContent;
