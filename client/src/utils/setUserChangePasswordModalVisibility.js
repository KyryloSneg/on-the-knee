import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setUserChangePasswordModalVisibility(isToShowModal, app) {
  app.setIsVisibleUserChangePasswordModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows()) return;
  
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setUserChangePasswordModalVisibility;