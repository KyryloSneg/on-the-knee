import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setAuthentificationModalVisibility(isToShowModal, app) {
  app.setIsVisibleAuthentificationModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows()) return;
  
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setAuthentificationModalVisibility;