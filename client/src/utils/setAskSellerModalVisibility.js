function setAskSellerModalVisibility(isToShowModal, app) {
  app.setIsVisibleAskSellerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.askSellerModalBtnRef?.current) app.askSellerModalBtnRef?.current?.focus();
}

export default setAskSellerModalVisibility;