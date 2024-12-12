import "./styles/AuthentificationModal.css";
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import { useCallback, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import AuthentificationModalContent from "./AuthentificationModalContent";
import setAuthentificationModalVisibility from "../utils/setAuthentificationModalVisibility";

const AuthentificationModal = observer(() => {
  const { app } = useContext(Context);

  const setIsAuthentificationModalVisible = useCallback(isVisible => {
    setAuthentificationModalVisibility(isVisible, app);
  }, [app]);

  const closeModal = useCallback(() => {
    setIsAuthentificationModalVisible(false)
  }, [setIsAuthentificationModalVisible]);

  return (
    <ModalWindow
      isVisible={app.isVisibleAuthentificationModal}
      setIsVisible={setIsAuthentificationModalVisible}
      children={<AuthentificationModalContent closeModal={closeModal} />}
      headerText="Authentification"
      id="authentification-modal"
      triggerElemRef={app.authentificationModalBtnRef}
    />
  );
});

export default AuthentificationModal;