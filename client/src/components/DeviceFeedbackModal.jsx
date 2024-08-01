import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setDeviceFeedbackModalVisibility from "../utils/setDeviceFeedbackModalVisibility";
import CommentModalContent from "./CommentModalContent";
import { observer } from "mobx-react-lite";

const DeviceFeedbackModal = observer(() => {
  const { app } = useContext(Context);

  function setIsDeviceFeedbackVisible(isVisible) {
    setDeviceFeedbackModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleDeviceFeedbackModal}
      setIsVisible={setIsDeviceFeedbackVisible}
      children={
        <CommentModalContent 
          type="feedback" 
          closeModal={() => setIsDeviceFeedbackVisible(false)} 
        />
      }
      headerText="Send feedback"
      propsClassName="create-comment-modal"
      id="device-feedback-modal"
      triggerElemRef={app.deviceFeedbackModalBtnRef}
    />
  );
});

export default DeviceFeedbackModal;
