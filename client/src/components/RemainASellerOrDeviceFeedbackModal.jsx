import "./styles/RemainASellerOrDeviceFeedbackModal.css";
import { observer } from "mobx-react-lite";
import { useContext } from 'react';
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setRemainSellerDevFeedbackModalVisibility from "../utils/setRemainSellerDevFeedbackModalVisibility";
import RemainSellerDevFeedback from "./RemainSellerDevFeedback";

// app.modalRemainDevCombosFeedbacksObj items must include "device" field
const RemainASellerOrDeviceFeedbackModal = observer(() => {
  const { app } = useContext(Context);

  function setIsRemainSellerDevFeedbackModalVisible(isVisible) {
    setRemainSellerDevFeedbackModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleRemainSellerDeviceFeedbackModal}
      setIsVisible={setIsRemainSellerDevFeedbackModalVisible}
      children={
        <RemainSellerDevFeedback 
          type="modal" 
          closeModal={() => setIsRemainSellerDevFeedbackModalVisible(false)}
        />
      }
      headerText="Remain a feedback"
      id="remain-seller-dev-feedback-modal"
      triggerElemRef={app.remainSellerDeviceFeedbackBtnRef}
      isCloserThanDarkBg={!app.isVisibleCommentGalleryModal}
    />
  );
});

export default RemainASellerOrDeviceFeedbackModal;
