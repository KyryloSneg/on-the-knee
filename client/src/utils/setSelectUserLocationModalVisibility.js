function setSelectUserLocationVisibility(isToShowModal, app) {
  app.setIsVisibleUserLocationModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.userLocationBtnRef?.current) app.userLocationBtnRef?.current?.focus();
}

export default setSelectUserLocationVisibility;