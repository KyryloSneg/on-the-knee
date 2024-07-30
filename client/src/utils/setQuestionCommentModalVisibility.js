function setQuestionCommentModalVisibility(isToShowModal, app) {
  app.setIsVisibleQuestionCommentModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.questionCommentModalBtnRef?.current) app.questionCommentModalBtnRef?.current?.focus();
}

export default setQuestionCommentModalVisibility;