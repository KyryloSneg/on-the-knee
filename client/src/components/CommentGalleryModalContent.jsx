import "./styles/CommentGalleryModalContent.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import ImagesCarousel from "./UI/imagesCarousel/ImagesCarousel";
import CommentsListItem from "./CommentsListItem";

const CommentGalleryModalContent = observer(({ type, singularCommentWord, closeModal }) => {
  const { app, deviceStore, user } = useContext(Context);

  let comment;
  if (type === "deviceFeedbacks") {
    comment = deviceStore.devicesFeedbacks?.find(feedback => feedback.id === deviceStore.selectedDeviceFeedbackId);
    // i'm lazy enough to not create another state to handle user feedbacks 
    if (!comment) comment = user.userDevicesFeedbacks?.find(feedback => feedback.id === deviceStore.selectedDeviceFeedbackId);
  } else if (type === "deviceQuestions") {
    comment = deviceStore.deviceQuestions?.find(question => question.id === deviceStore.selectedDeviceQuestionId);
  } else if (type === "sellerFeedbacks") {
    comment = deviceStore.sellersFeedbacks?.find(feedback => feedback.id === deviceStore.selectedSellerFeedbackId);
    if (!comment && Array.isArray(user.ordersListSellers)) {
      for (let ordersListSellerObj of user.ordersListSellers) {
        const possibleComment = ordersListSellerObj.feedbacks.find(
          feedback => feedback.id === deviceStore.selectedSellerFeedbackId
        );
        
        if (possibleComment) comment = possibleComment;
      }
    }
  }

  let carouselImages = [];
  if (comment) {
    for (let image of comment?.images) {
      const src = typeof image === "object" ? image?.fileObj : image;
      carouselImages.push({ src: src, alt: "", style: { transform: `rotate(${image?.rotateDegrees || 0}deg)` } })
    }
  }

  return (  
    <div className="comment-gallery-comment-content">
      <ImagesCarousel 
        images={carouselImages} 
        isInModal={true}
        initialSelectedId={app.commentGallerySelectedImageId} 
      />
      <CommentsListItem 
        type={type} 
        comment={comment} 
        singularCommentWord={singularCommentWord} 
        isWithImages={false}
        closeGalleryModal={closeModal}
      />
    </div>
  );
});

export default CommentGalleryModalContent;
