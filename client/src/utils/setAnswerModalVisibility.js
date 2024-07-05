function setAnswerModalVisibility(isToShowModal, app) {
  app.setIsVisibleAnswerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setAnswerModalVisibility;