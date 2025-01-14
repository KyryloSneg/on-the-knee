import "./styles/CommentGalleryModal.css";
import { useContext, useEffect, useRef } from 'react';
import { Context } from '../Context';
import { observer } from "mobx-react-lite";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import CommentGalleryModalContent from "./CommentGalleryModalContent";
import setCommentGalleryModalVisibility from "../utils/setCommentGalleryModalVisibility";

const POSSIBLE_TYPES = ["deviceFeedbacks", "deviceQuestions", "sellerFeedbacks"];
const CommentGalleryModal = observer(() => {
  const { app } = useContext(Context);
  const prevBtnRef = useRef(app.lastWindowBtnRef);

  const type = app.commentGalleryModalType;

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CommentGalleryModal is not defined or incorrect");

  let singularCommentWord;
  if (type === "deviceFeedbacks" || type === "sellerFeedbacks") {
    singularCommentWord = "feedback";
  } else if (type === "deviceQuestions") {
    singularCommentWord = "question";
  }

  function setIsCommentGalleryVisible(isVisible, isToKeepDarkBg = false) {
    if (
      app.commentGalleryIsOpenedFromRemainFeedbackModal
      && !isVisible && prevBtnRef.current
    ) app.setLastWindowBtnRef(prevBtnRef.current);

    setCommentGalleryModalVisibility(isVisible, app, isToKeepDarkBg, app.commentGalleryModalBtnRef);
  }

  useEffect(() => {
    return () => {
      if (!app.isVisibleCommentGalleryModal) {
        // resetting global states
        app.setCommentModalGetCommentsQueryParamsStr("");
        app.setCommentGalleryModalType("deviceFeedbacks");
        app.setCommentGallerySelectedImageId(null);
        app.setCommentGalleryIsOpenedFromRemainFeedbackModal(false);
      }
    }
  }, [app]);
  
  return (
    <ModalWindow
      isVisible={app.isVisibleCommentGalleryModal}
      setIsVisible={setIsCommentGalleryVisible}
      children={
        <CommentGalleryModalContent 
          type={type} 
          singularCommentWord={singularCommentWord} 
          closeModal={() => setIsCommentGalleryVisible(false, true)}
        />
      }
      headerText={`Photos of ${singularCommentWord}`}
      id="comment-gallery-modal"
      triggerElemRef={app.commentGalleryModalBtnRef}
      isToFocusTriggerElem={!app.commentGalleryIsOpenedFromRemainFeedbackModal}
    />
  );
});

export default CommentGalleryModal;
