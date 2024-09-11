import { useContext } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";

const ErrorModal = observer(() => {
  const { app } = useContext(Context);

  function setIsErrorModalVisible(isVisible) {
    setErrorModalVisibility(isVisible, app);
  }

  return (
    <ModalWindow
      isVisible={app.isVisibleErrorModal}
      setIsVisible={setIsErrorModalVisible}
      children={app.errorModalInfo.children}
      headerText="Error has occured"
      propsClassName={app.errorModalInfo.className || ""}
      id={app.errorModalInfo.id}
      triggerElemRef={app.errorModalBtnRef}
    />
  );
});

export default ErrorModal;