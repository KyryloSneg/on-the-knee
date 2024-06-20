import "./CommentReply.css";

const CommentReply = ({ reply }) => {
  return (
    <section className="comment-reply">
      {reply.id}
    </section>
  );
}

export default CommentReply;
