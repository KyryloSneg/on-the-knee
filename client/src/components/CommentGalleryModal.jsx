import "./styles/CommentGalleryModal.css";
import { useContext } from 'react';
import { Context } from '../Context';
import { observer } from "mobx-react-lite";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import CommentGalleryModalContent from "./CommentGalleryModalContent";
import setCommentGalleryModalVisibility from "../utils/setCommentGalleryModalVisibility";

const POSSIBLE_TYPES = ["deviceFeedbacks", "deviceQuestions"];
const CommentGalleryModal = observer(() => {
  const { app } = useContext(Context);
  const type = app.commentGalleryModalType;

  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CommentGalleryModal is not defined or incorrect");

  let singularCommentWord;
  if (type === "deviceFeedbacks") {
    singularCommentWord = "feedback";
  } else if (type === "deviceQuestions") {
    singularCommentWord = "question";
  }

  function setIsCommentGalleryVisible(isVisible, isToKeepDarkBg = false) {
    setCommentGalleryModalVisibility(isVisible, app, isToKeepDarkBg);
  }

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
    />
  );
});

export default CommentGalleryModal;
