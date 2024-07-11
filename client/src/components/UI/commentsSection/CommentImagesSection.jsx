import "./CommentImagesSection.css";
import CustomScrollbar from '../customScrollbar/CustomScrollbar';
import setCommentGalleryModalVisibility from "../../../utils/setCommentGalleryModalVisibility";
import { useContext } from "react";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";

const CommentImagesSection = observer(({ imagesObjs, type }) => {
  const { app } = useContext(Context);

  function onClick(commentId, index) {
    // set visibility and some states of a comment's image modal to true
    if (type === "deviceFeedbacks") {
      app.setSelectedDeviceFeedbackId(commentId);
    } else if (type === "deviceQuestions") {
      app.setSelectedDeviceQuestionId(commentId);
    } else if (type === "sellerFeedbacks") {
      app.setSelectedSellerFeedbackId(commentId);
    }

    app.setCommentGalleryModalType(type);
    app.setCommentGallerySelectedImageId(index);
    setCommentGalleryModalVisibility(true, app);
  }

  return (
    <CustomScrollbar
      children={
        <ul className="comment-images-section">
          {imagesObjs.map((imageObj, outerIndex) => {
            return imageObj.images.map((image, innerIndex) => {
              // { fileObj: "href", rotateDegrees: 0 } || "href"
              const src = typeof image === "object" ? image?.fileObj : image;

              return (
                <li key={`${outerIndex}-${innerIndex}`}>
                  <button onClick={() => onClick(imageObj.commentId, innerIndex)}>
                    <img 
                      src={src} 
                      alt="" 
                      draggable="false" 
                      style={{ transform: `rotate(${image?.rotateDegrees || 0}deg)` }} 
                    />
                  </button>
                </li>
              );
            });
          })}
        </ul>
      }
    />
  );
});

export default CommentImagesSection;
