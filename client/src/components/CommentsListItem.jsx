import "./styles/CommentsListItem.css";
import { useState } from "react";
import CommentRepliesList from "./CommentRepliesList";
import OriginalComment from "./OriginalComment";
import useOneDeviceFeedbacksFetching from "hooks/useOneDeviceFeedbacksFetching";
import useOneSellerFeedbacksFetching from "hooks/useOneSellerFeedbacksFetching";
import useOneSellerFetching from "hooks/useOneSellerFetching";

const CommentsListItem = ({ 
  type, comment, singularCommentWord, propsUser = undefined, isWithImages = true, 
  closeGalleryModal = null, isInModal = false, updateFetchesQueryParams = "" 
}) => {
  const [seller, setSeller] = useState(comment?.seller || null);

  const isToFetchSeller = (comment?.sellerId !== null && comment?.sellerId !== undefined) && !seller;
  useOneSellerFetching(comment?.sellerId, setSeller, isToFetchSeller, false);

  const isGalleryModal = !!closeGalleryModal;
  
  const [sellerFeedbacksFetching] = useOneSellerFeedbacksFetching(comment?.sellerId, null, true, updateFetchesQueryParams);
  const deviceFeedbacksFetching = useOneDeviceFeedbacksFetching(
    comment?.device?.id, null, null, true, true, false, updateFetchesQueryParams
  );
  const deviceQuestionsFetching = useOneDeviceFeedbacksFetching(
    comment?.device?.id, null, null, true, false, true, updateFetchesQueryParams
  );
  
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
        propsUser={propsUser}
        type={type}
        seller={seller}
        singularCommentWord={singularCommentWord} 
        isWithImages={isWithImages}
        closeGalleryModal={closeGalleryModal}
        isInModal={isInModal || isGalleryModal}
        deviceFeedbacksFetching={deviceFeedbacksFetching}
        deviceQuestionsFetching={deviceQuestionsFetching}
        sellerFeedbacksFetching={sellerFeedbacksFetching}
      />
      {!!replies?.length && (
        <CommentRepliesList 
          type={type} 
          replies={replies} 
          seller={seller}
          deviceId={comment?.deviceId}
          isInModal={isInModal || isGalleryModal}
          deviceFeedbacksFetching={deviceFeedbacksFetching}
          deviceQuestionsFetching={deviceQuestionsFetching}
          sellerFeedbacksFetching={sellerFeedbacksFetching}
        />
      )}
    </div>
  );
}

export default CommentsListItem;
