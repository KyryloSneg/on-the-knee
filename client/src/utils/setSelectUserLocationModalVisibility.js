function setSelectUserLocationVisibility(isToShowModal, app) {
  app.setIsVisibleUserLocationModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setSelectUserLocationVisibility;