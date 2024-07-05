function setDeviceFeedbackModalVisibility(isToShowModal, app) {
  app.setIsVisibleDeviceFeedbackModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setDeviceFeedbackModalVisibility;