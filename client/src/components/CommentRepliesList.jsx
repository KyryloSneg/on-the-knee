import "./styles/CommentRepliesList.css";
import CommentReply from './CommentReply';

const CommentRepliesList = ({ replies, type, seller }) => {
  return (
    <ul className="comments-replies-list">
      {replies.map(reply => 
        <li key={reply.id}>
          <CommentReply reply={reply} type={type} seller={seller} />
        </li>
      )}
    </ul>
  );
}

export default CommentRepliesList;
