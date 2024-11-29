import "./styles/CommentRepliesList.css";
import CommentReply from './CommentReply';

const CommentRepliesList = ({ 
  replies, type, seller, deviceId, isInModal,
  updateDeviceFeedbacksCb, deviceQuestionsFetching, 
  areUserFeedbacks 
}) => {
  return (
    <ul className="comments-replies-list">
      {replies.map(reply => 
        <li key={reply.id}>
          <CommentReply 
            reply={reply} 
            type={type} 
            seller={seller} 
            deviceId={deviceId}
            isInModal={isInModal}
            updateDeviceFeedbacksCb={updateDeviceFeedbacksCb}
            deviceQuestionsFetching={deviceQuestionsFetching}
            areUserFeedbacks={areUserFeedbacks}
          />
        </li>
      )}
    </ul>
  );
}

export default CommentRepliesList;
