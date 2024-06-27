function setAnswerModalVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleAnswerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setAnswerModalVisibility;