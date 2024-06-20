import "./CommentsList.css";
import CommentsListItem from "./CommentsListItem";

const CommentsList = ({ type, comments }) => {
  return (
    <ul className="comments-list">
      {comments.map(comment => 
        <li key={comment.id}>
          <CommentsListItem type={type} comment={comment} />
        </li>
      )}
    </ul>
  );
}

export default CommentsList;
