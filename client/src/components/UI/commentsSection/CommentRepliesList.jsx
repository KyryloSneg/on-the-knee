import "./CommentRepliesList.css";
import CommentReply from './CommentReply';

const CommentRepliesList = ({ replies }) => {
  return (
    <ul className="comments-replies-list">
      {replies.map(reply => 
        <li key={reply.id}>
          <CommentReply reply={reply} />
        </li>
      )}
    </ul>
  );
}

export default CommentRepliesList;
