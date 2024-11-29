import { useContext } from "react";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import { Context } from "../Context";
import setReplyModalVisibility from "../utils/setReplyModalVisibility";
import CommentModalContent from "./CommentModalContent";
import { observer } from "mobx-react-lite";

const ReplyModal = observer(() => {
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
          isModalVisible={app.isVisibleReplyModal}
          areUserFeedbacks={app.commentModalContentAreUserFeedbacks}
        />
      }
      headerText="Reply"
      propsClassName="create-comment-modal"
      id="reply-modal"
      triggerElemRef={app.replyModalBtnRef}
    />
  );
});

export default ReplyModal;
