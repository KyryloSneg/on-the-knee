import { useState } from "react";
import CommentRepliesList from "./CommentRepliesList";
import "./CommentsListItem.css";
import useGettingOneUser from "../../../hooks/useGettingOneUser";
import OriginalComment from "./OriginalComment";

const CommentsListItem = ({ type, comment, singularCommentWord, isWithImages = true, closeGalleryModal = null }) => {
  const [user, setUser] = useState(null);
  useGettingOneUser(comment.userId, setUser, true, !comment.isAnonymously && !user);

  let replies;
  if (type === "deviceFeedbacks") {
    replies = comment["device-feedback-replies"];
  } else if (type === "deviceQuestions") {
    replies = comment["device-answers"];
  }

  return (
    <div className="comments-list-item">
      <OriginalComment 
        comment={comment} 
        user={user} 
        type={type}
        singularCommentWord={singularCommentWord} 
        isWithImages={isWithImages}
        closeGalleryModal={closeGalleryModal}
      />
      {!!replies?.length && <CommentRepliesList type={type} replies={replies} />}
    </div>
  );
}

export default CommentsListItem;
