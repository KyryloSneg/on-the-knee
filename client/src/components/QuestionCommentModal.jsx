import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setQuestionCommentModalVisibility from "../utils/setQuestionCommentModalVisibility";
import CommentModalContent from "./CommentModalContent";
import { observer } from "mobx-react-lite";

const QuestionCommentModal = observer(() => {
  const { app } = useContext(Context);

  function setIsQuestionCommentVisible(isVisible) {
    setQuestionCommentModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleQuestionCommentModal}
      setIsVisible={setIsQuestionCommentVisible}
      children={
        <CommentModalContent 
          type="question" 
          closeModal={() => setIsQuestionCommentVisible(false)}
        />
      }
      headerText="Ask a question"
      propsClassName="create-comment-modal"
      id="question-comment-modal"
      triggerElemRef={app.questionCommentModalBtnRef}
    />
  );
});

export default QuestionCommentModal;
