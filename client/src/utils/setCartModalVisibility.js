function setCartModalVisibility(isToShowModal, app) {
  app.setIsVisibleCartModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setCartModalVisibility;