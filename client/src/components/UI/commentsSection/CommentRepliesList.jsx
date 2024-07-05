import "./CommentRepliesList.css";
import CommentReply from './CommentReply';

const CommentRepliesList = ({ replies, type }) => {
  return (
    <ul className="comments-replies-list">
      {replies.map(reply => 
        <li key={reply.id}>
          <CommentReply reply={reply} type={type} />
        </li>
      )}
    </ul>
  );
}

export default CommentRepliesList;
