function setDeviceFeedbackModalVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleDeviceFeedbackModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setDeviceFeedbackModalVisibility;