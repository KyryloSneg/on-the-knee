import "./styles/DeviceFeedbackModal.css";
import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setDeviceFeedbackModalVisibility from "../utils/setDeviceFeedbackModalVisibility";
import CommentModalContent from "./CommentModalContent";

const DeviceFeedbackModal = () => {
  const { app } = useContext(Context);

  function setIsDeviceFeedbackVisible(isVisible) {
    setDeviceFeedbackModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleDeviceFeedbackModal}
      setIsVisible={setIsDeviceFeedbackVisible}
      children={<CommentModalContent type="feedback" />}
      headerText="Send feedback"
      id="device-feedback-modal"
    />
  );
}

export default DeviceFeedbackModal;
