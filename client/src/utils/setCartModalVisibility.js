function setCartModalVisibility(isToShowModal, app) {
  app.setIsVisibleCartModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setCartModalVisibility;