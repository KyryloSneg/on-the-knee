import "./CommentsList.css";
import CommentsListItem from "./CommentsListItem";

const CommentsList = ({ type, comments, singularCommentWord }) => {
  return (
    <ul className="comments-list">
      {comments.map(comment => 
        <li key={comment.id}>
          <CommentsListItem type={type} comment={comment} singularCommentWord={singularCommentWord} />
        </li>
      )}
    </ul>
  );
}

export default CommentsList;
