import "./styles/ErrorModal.css";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import ModalWindow from "./UI/modalWindow/ModalWindow";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";
import { ERROR_MODAL_INITIAL_INFO } from "utils/consts";

const ErrorModal = observer(() => {
  const { app } = useContext(Context);
  const prevBtnRef = useRef(app.lastWindowBtnRef)

  function setIsErrorModalVisible(isVisible) {
    if (!isVisible && prevBtnRef.current) app.setLastWindowBtnRef(prevBtnRef.current);
    setErrorModalVisibility(isVisible, app, app.errorModalBtnRef);
  }

  let className = "error-modal";
  if (app.errorModalInfo.className) {
    className += ` ${app.errorModalInfo.className}`;
  }

  useEffect(() => {
    return () => {
      if (!app.isVisibleErrorModal) {
        // resetting states to the initial ones
        app.setErrorModalInfo(ERROR_MODAL_INITIAL_INFO);
        app.setErrorModalBtnRef(null);
        app.setIsToFocusErrorModalPrevModalTriggerElem(true);
      }
    }
  }, [app, app.isVisibleErrorModal]);
  
  return (
    <ModalWindow
      isVisible={app.isVisibleErrorModal}
      setIsVisible={setIsErrorModalVisible}
      children={app.errorModalInfo.children}
      headerText="Error has occured"
      propsClassName={className}
      id={app.errorModalInfo.id}
      triggerElemRef={app.errorModalBtnRef}
      isToFocusTriggerElem={app.isToFocusErrorModalPrevModalTriggerElem}
    />
  );
});

export default ErrorModal;