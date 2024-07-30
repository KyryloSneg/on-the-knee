function setDeviceFeedbackModalVisibility(isToShowModal, app) {
  app.setIsVisibleDeviceFeedbackModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.deviceFeedbackModalBtnRef?.current) app.deviceFeedbackModalBtnRef?.current?.focus();
}

export default setDeviceFeedbackModalVisibility;