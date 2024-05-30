function setSelectUserLocationVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleUserLocationModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setSelectUserLocationVisibility;