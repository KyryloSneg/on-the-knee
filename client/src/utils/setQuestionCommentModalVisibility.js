function setQuestionCommentModalVisibility(isToShowModal, app) {
  app.setIsVisibleQuestionCommentModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setQuestionCommentModalVisibility;