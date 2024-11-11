import "./styles/CommentsListItem.css";
import { useState } from "react";
import CommentRepliesList from "./CommentRepliesList";
import useGettingOneUser from "../hooks/useGettingOneUser";
import OriginalComment from "./OriginalComment";
import useOneSellerFetching from "hooks/useOneSellerFetching";

const CommentsListItem = ({ 
  type, comment, singularCommentWord, propsUser = null, isWithImages = true, closeGalleryModal = null 
}) => {
  const [user, setUser] = useState(comment?.user || propsUser);
  const [seller, setSeller] = useState(comment?.seller || null);
  
  useGettingOneUser(comment?.userId, setUser, true, !comment.isAnonymously && !user);
  useOneSellerFetching(comment?.device?.sellerId, setSeller, comment?.device?.sellerId && !seller, false);

  let replies;
  if (type === "deviceFeedbacks") {
    replies = comment["device-feedback-replies"];
  } else if (type === "deviceQuestions") {
    replies = comment["device-answers"];
  }

  if (replies) replies.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="comments-list-item">
      <OriginalComment 
        comment={comment} 
        user={user} 
        seller={seller}
        type={type}
        singularCommentWord={singularCommentWord} 
        isWithImages={isWithImages}
        closeGalleryModal={closeGalleryModal}
      />
      {!!replies?.length && <CommentRepliesList type={type} replies={replies} seller={seller} />}
    </div>
  );
}

export default CommentsListItem;
