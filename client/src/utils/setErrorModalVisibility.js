import { ERROR_MODAL_INITIAL_INFO } from "./consts";
import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setErrorModalVisibility(isToShowModal, app, btnRef = null) {
  app.setIsVisibleErrorModal(isToShowModal);

  if (isToShowModal) {
    app.setIsToSetLastBtnRefInCurrWindow(true);
  } else {
    app.setErrorModalInfo(ERROR_MODAL_INITIAL_INFO);
    app.setErrorModalBtnRef(null);

    // resetting this state to the initial value
    app.setIsToFocusErrorModalPrevModalTriggerElem(true);
    if (btnRef) btnRef?.current?.focus?.();
  }

  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setErrorModalVisibility;