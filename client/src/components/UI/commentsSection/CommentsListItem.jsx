import CommentRepliesList from "./CommentRepliesList";
import "./CommentsListItem.css";

const CommentsListItem = ({ type, comment }) => {
  let replies;
  if (type === "deviceFeedbacks") {
    replies = comment["device-feedback-replies"];
  } else if (type === "deviceQuestions") {
    replies = comment["device-answers"];
  } else if (type === "sellerFeedbacks") {
    replies = comment["seller-feedback-replies"];
  }

  return (
    <section className="comments-list-item">
      {comment.id}
      <CommentRepliesList replies={replies} />
    </section>
  );
}

export default CommentsListItem;
