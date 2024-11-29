import "./styles/CommentsList.css";
import CommentsListItem from "./CommentsListItem";

const CommentsList = ({ 
  type, comments, singularCommentWord, propsUser = null, isInModal = false, 
  updateFetchesQueryParams = "", areUserFeedbacks = false, userOrderDeviceCombinations = null, 
  closeRemainAFeedbackModal = null, ...props 
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
            areUserFeedbacks={areUserFeedbacks}
            userOrderDeviceCombinations={userOrderDeviceCombinations}
            closeRemainAFeedbackModal={closeRemainAFeedbackModal}
          />
        </li>
      )}
    </ul>
  );
}

export default CommentsList;
