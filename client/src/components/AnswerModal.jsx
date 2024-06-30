import "./styles/AnswerModal.css";
import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setAnswerModalVisibility from "../utils/setAnswerModalVisibility";
import CommentModalContent from "./CommentModalContent";

const AnswerModal = () => {
  const { app } = useContext(Context);

  function setIsAnswerModalVisible(isVisible) {
    setAnswerModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleAnswerModal}
      setIsVisible={setIsAnswerModalVisible}
      children={
        <CommentModalContent 
          type="answer" 
          closeModal={() => setIsAnswerModalVisible(false)}
        />
      }
      headerText="Answer"
      propsClassName="create-comment-modal"
      id="answer-modal"
    />
  );
}

export default AnswerModal;
