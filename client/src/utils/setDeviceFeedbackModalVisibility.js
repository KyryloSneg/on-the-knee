function setDeviceFeedbackModalVisibility(isToShowModal, app) {
  app.setIsVisibleDeviceFeedbackModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setDeviceFeedbackModalVisibility;