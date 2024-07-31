import "./styles/SelfDeliveryModal.css";
import { useContext } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import { observer } from 'mobx-react-lite';
import SelfDeliveryModalContent from "./SelfDeliveryModalContent";
import setSelfDeliveryModalVisibility from "../utils/setSelfDeliveryModalVisibility";

const SelfDeliveryModal = observer(() => {
  const { app } = useContext(Context);

  function setIsSelfDeliveryVisible(isVisible) {
    setSelfDeliveryModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleSelfDeliveryModal}
      setIsVisible={setIsSelfDeliveryVisible}
      children={<SelfDeliveryModalContent />}
      headerText="Pickup points"
      id="self-delivery-modal"
      triggerElemRef={app.selfDeliveryModalBtnRef}
      key="self-delivery-modal"
    />
  );
});

export default SelfDeliveryModal;
