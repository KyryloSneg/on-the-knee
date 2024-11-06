import "./styles/CommentsList.css";
import CommentsListItem from "./CommentsListItem";

const CommentsList = ({ type, comments, singularCommentWord, propsUser = null, ...props }) => {
  return (
    <ul className="comments-list" {...props}>
      {comments.map(comment => 
        <li key={comment.id}>
          <CommentsListItem 
            type={type} 
            comment={comment} 
            singularCommentWord={singularCommentWord} 
            propsUser={propsUser}
          />
        </li>
      )}
    </ul>
  );
}

export default CommentsList;
