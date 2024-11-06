import "./styles/UserChangePasswordModal.css";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useCallback, useContext } from "react";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import setUserChangePasswordModalVisibility from "utils/setUserChangePasswordModalVisibility";
import UserChangePasswordModalContent from "./UserChangePasswordModalContent";

const UserChangePasswordModal = observer(() => {
  const { app } = useContext(Context);

  const setIsUserChangePasswordModalVisible = useCallback(isVisible => {
    setUserChangePasswordModalVisibility(isVisible, app);
  }, [app]);

  const closeModal = useCallback(() => setIsUserChangePasswordModalVisible(false), [setIsUserChangePasswordModalVisible]);

  return (
    <ModalWindow
      isVisible={app.isVisibleUserChangePasswordModal}
      setIsVisible={setIsUserChangePasswordModalVisible}
      children={<UserChangePasswordModalContent closeModal={closeModal} />}
      headerText="Change password"
      id="user-change-password-modal"
      triggerElemRef={app.userChangePasswordModalBtnRef}
    />
  );
});

export default UserChangePasswordModal;
