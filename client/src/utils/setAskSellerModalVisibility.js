function setAskSellerModalVisibility(isToShowModal, app) {
  app.setIsVisibleAskSellerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setAskSellerModalVisibility;