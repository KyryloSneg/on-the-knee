import "./styles/CommentGalleryModalContent.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import ImagesCarousel from "./UI/imagesCarousel/ImagesCarousel";
import CommentsListItem from "./UI/commentsSection/CommentsListItem";

const CommentGalleryModalContent = observer(({ type, singularCommentWord, closeModal }) => {
  const { app } = useContext(Context);

  let comment;
  if (type === "deviceFeedbacks") {
    comment = app.deviceFeedbacks?.find(feedback => feedback.id === app.selectedDeviceFeedbackId);
  } else if (type === "deviceQuestions") {
    comment = app.deviceQuestions?.find(question => question.id === app.selectedDeviceQuestionId);
  }

  let carouselImages = [];
  for (let image of comment?.images) {
    carouselImages.push({ src: image, alt: "" })
  }

  return (  
    <div className="comment-gallery-comment-content">
      <ImagesCarousel images={carouselImages} initialSelectedId={app.commentGallerySelectedImageId} />
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
