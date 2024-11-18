import "./styles/CommentsList.css";
import CommentsListItem from "./CommentsListItem";

const CommentsList = ({ 
  type, comments, singularCommentWord, propsUser = null, isInModal = false, updateFetchesQueryParams = "", ...props 
}) => {
  return (
    <ul className="comments-list" {...props}>
      {comments.map(comment => 
        <li key={comment.id}>
          <CommentsListItem 
            type={type} 
            comment={comment} 
            singularCommentWord={singularCommentWord} 
            propsUser={propsUser}
            isInModal={isInModal}
            updateFetchesQueryParams={updateFetchesQueryParams}
          />
        </li>
      )}
    </ul>
  );
}

export default CommentsList;
