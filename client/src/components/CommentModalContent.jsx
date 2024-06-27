import "./styles/CommentModalContent.css";

const POSSIBLE_TYPES = ["feedback", "reply", "question", "answer"];
const CommentModalContent = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Comment Modal Content is not defined or incorrect");

  return (
    <section className="comment-modal-content">
      {type}
    </section>
  );
}

export default CommentModalContent;
