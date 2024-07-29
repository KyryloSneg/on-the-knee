import { useContext } from "react";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import { Context } from "../Context";
import setReplyModalVisibility from "../utils/setReplyModalVisibility";
import CommentModalContent from "./CommentModalContent";

const ReplyModal = () => {
  const { app } = useContext(Context);

  function setIsReplyModalVisible(isVisible) {
    setReplyModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleReplyModal}
      setIsVisible={setIsReplyModalVisible}
      children={
        <CommentModalContent 
          type="reply" 
          closeModal={() => setIsReplyModalVisible(false)}
        />
      }
      headerText="Reply"
      propsClassName="create-comment-modal"
      id="reply-modal"
    />
  );
}

export default ReplyModal;
