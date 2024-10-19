function setRemainSellerDevFeedbackModalVisibility(isToShowModal, app) {
  app.setIsVisibleRemainSellerDeviceFeedbackModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setRemainSellerDevFeedbackModalVisibility;