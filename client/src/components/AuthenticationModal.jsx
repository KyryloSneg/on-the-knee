import "./styles/AuthentificationModal.css";
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import AuthentificationModalContent from "./AuthentificationModalContent";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";

const AuthentificationModal = observer(() => {
  const { app } = useContext(Context);

  function setIsAuthentificationModalVisible(isVisible) {
    setAuthentificationModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleAuthentificationModal}
      setIsVisible={setIsAuthentificationModalVisible}
      children={
        <AuthentificationModalContent 
          closeModal={() => setIsAuthentificationModalVisible(false)}
        />
      }
      headerText="Authentification"
      id="authentification-modal"
      triggerElemRef={app.authentificationModalBtnRef}
    />
  );
});

export default AuthentificationModal;