import "./styles/QuestionCommentModal.css";
import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setQuestionCommentModalVisibility from "../utils/setQuestionCommentModalVisibility";
import CommentModalContent from "./CommentModalContent";

const QuestionCommentModal = () => {
  const { app } = useContext(Context);

  function setIsQuestionCommentVisible(isVisible) {
    setQuestionCommentModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleQuestionCommentModal}
      setIsVisible={setIsQuestionCommentVisible}
      children={<CommentModalContent type="question" />}
      headerText="Ask a question"
      id="question-comment-modal"
    />
  );
}

export default QuestionCommentModal;
