function setQuestionCommentModalVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleQuestionCommentModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setQuestionCommentModalVisibility;