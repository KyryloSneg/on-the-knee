import { ERROR_MODAL_INITIAL_INFO } from "./consts";

function setErrorModalVisibility(isToShowModal, app) {
  app.setIsVisibleErrorModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) {
    app.setIsToSetLastBtnRefInCurrWindow(true);
  } else {
    app.setErrorModalInfo(ERROR_MODAL_INITIAL_INFO);
    app.setErrorModalBtnRef(null);
  }
}

export default setErrorModalVisibility;