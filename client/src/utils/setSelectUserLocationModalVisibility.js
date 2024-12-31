import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setSelectUserLocationVisibility(isToShowModal, app) {
  app.setIsVisibleUserLocationModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setSelectUserLocationVisibility;