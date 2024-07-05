function setSelectUserLocationVisibility(isToShowModal, app) {
  app.setIsVisibleUserLocationModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setSelectUserLocationVisibility;