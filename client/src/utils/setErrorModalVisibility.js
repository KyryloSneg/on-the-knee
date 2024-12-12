import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setErrorModalVisibility(isToShowModal, app, btnRef = null) {
  app.setIsVisibleErrorModal(isToShowModal);

  if (isToShowModal) {
    app.setIsToSetLastBtnRefInCurrWindow(true);
  } else {
    if (btnRef) btnRef?.current?.focus?.();
  }

  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setErrorModalVisibility;