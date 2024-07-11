function setAskSellerModalVisibility(isToShowModal, app) {
  app.setIsVisibleAskSellerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setAskSellerModalVisibility;