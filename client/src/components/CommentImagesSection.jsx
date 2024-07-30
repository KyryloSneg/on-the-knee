import "./styles/CommentImagesSection.css";
import CustomScrollbar from './UI/customScrollbar/CustomScrollbar';
import setCommentGalleryModalVisibility from "../utils/setCommentGalleryModalVisibility";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const CommentImagesSection = observer(({ imagesObjs, type }) => {
  const { app, deviceStore } = useContext(Context);
  const btnRefs = useRef([]);

  let imagesAmount = useRef(null);
  let futureImagesAmount = 0;

  useEffect(() => {
    imagesAmount.current = futureImagesAmount;
    return () => imagesAmount.current = null;
    // eslint-disable-next-line
  }, [imagesObjs]);

  function onClick(commentId, index, btnRefIndex) {
    // set visibility and some states of a comment's image modal to true
    if (type === "deviceFeedbacks") {
      deviceStore.setSelectedDeviceFeedbackId(commentId);
    } else if (type === "deviceQuestions") {
      deviceStore.setSelectedDeviceQuestionId(commentId);
    } else if (type === "sellerFeedbacks") {
      deviceStore.setSelectedSellerFeedbackId(commentId);
    }

    // let's pretend that it's a ref
    app.setCommentGalleryModalBtnRef({ current: btnRefs.current[btnRefIndex] });
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
              
              futureImagesAmount += 1;
              const btnRefIndex = futureImagesAmount - 1;

              return (
                <li key={`${outerIndex}-${innerIndex}`}>
                  <button 
                    onClick={() => onClick(imageObj.commentId, innerIndex, btnRefIndex)}
                    ref={ref => {
                      if (btnRefs.current.length === imagesAmount.current && imagesAmount.current) return;
                      btnRefs.current.push(ref);
                    }}
                  >
                    <img 
                      src={src} 
                      alt="Open" 
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
