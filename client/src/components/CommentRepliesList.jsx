import "./styles/CommentRepliesList.css";
import CommentReply from './CommentReply';

const CommentRepliesList = ({ 
  replies, type, seller, deviceId, isInModal,
  deviceFeedbacksFetching, deviceQuestionsFetching, sellerFeedbacksFetching 
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
            deviceFeedbacksFetching={deviceFeedbacksFetching}
            deviceQuestionsFetching={deviceQuestionsFetching}
            sellerFeedbacksFetching={sellerFeedbacksFetching}
          />
        </li>
      )}
    </ul>
  );
}

export default CommentRepliesList;
