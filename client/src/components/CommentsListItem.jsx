import "./styles/CommentsListItem.css";
import { useContext, useState } from "react";
import CommentRepliesList from "./CommentRepliesList";
import OriginalComment from "./OriginalComment";
import useOneDeviceFeedbacksFetching from "hooks/useOneDeviceFeedbacksFetching";
import useOneSellerFeedbacksFetching from "hooks/useOneSellerFeedbacksFetching";
import useOneSellerFetching from "hooks/useOneSellerFetching";
import useUserDevicesFeedbacksFetching from "hooks/useUserDevicesFeedbacksFetching";
import useOrdersListSellersFetching from "hooks/useOrdersListSellersFetching";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import useUpdatingFeedbacksCbs from "hooks/useUpdatingFeedbacksCbs";

const CommentsListItem = observer(({ 
  type, comment, singularCommentWord, propsUser = undefined, isWithImages = true, 
  closeGalleryModal = null, isInModal = false, updateFetchesQueryParams = "",
  areUserFeedbacks = false, userOrderDeviceCombinations = null, closeRemainAFeedbackModal = null
}) => {
  const { user } = useContext(Context);
  const [seller, setSeller] = useState(comment?.seller || null);

  const isToFetchSeller = (comment?.sellerId !== null && comment?.sellerId !== undefined) && !seller;
  useOneSellerFetching(comment?.sellerId, setSeller, isToFetchSeller, false);

  const isGalleryModal = !!closeGalleryModal;
  
  const [sellerFeedbacksFetching] = useOneSellerFeedbacksFetching(comment?.sellerId, null, true, false);  
  const deviceFeedbacksFetching = useOneDeviceFeedbacksFetching(
    comment?.device?.id, null, null, true, true, false, updateFetchesQueryParams, false, areUserFeedbacks
  );
  const deviceQuestionsFetching = useOneDeviceFeedbacksFetching(
    comment?.device?.id, null, null, true, false, true, updateFetchesQueryParams
  );

  const [userDevicesFeedbacksFetching] = useUserDevicesFeedbacksFetching(
    userOrderDeviceCombinations, null, true, true, true, false
  );

  const [userSellersFeedbacksFetching] = useOrdersListSellersFetching(user.orders, null, true, true, true);
  
  const { updateDeviceFeedbacksCb, updateSellerFeedbacksCb } = useUpdatingFeedbacksCbs(
    comment?.device?.id, comment?.sellerId, areUserFeedbacks, deviceFeedbacksFetching,
    sellerFeedbacksFetching, userDevicesFeedbacksFetching, userSellersFeedbacksFetching
  );
  
  let replies;
  if (type === "deviceFeedbacks") {
    replies = comment["device-feedback-replies"]?.slice();
  } else if (type === "deviceQuestions") {
    replies = comment["device-answers"]?.slice();
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
        deviceQuestionsFetching={deviceQuestionsFetching}
        areUserFeedbacks={areUserFeedbacks}
        updateDeviceFeedbacksCb={updateDeviceFeedbacksCb}
        updateSellerFeedbacksCb={updateSellerFeedbacksCb}
        closeRemainAFeedbackModal={closeRemainAFeedbackModal}
      />
      {!!replies?.length && (
        <CommentRepliesList 
          type={type} 
          replies={replies} 
          seller={seller}
          deviceId={comment?.deviceId}
          isInModal={isInModal || isGalleryModal}
          updateDeviceFeedbacksCb={updateDeviceFeedbacksCb}
          deviceQuestionsFetching={deviceQuestionsFetching}
          areUserFeedbacks={areUserFeedbacks}
        />
      )}
    </div>
  );
});

export default CommentsListItem;
