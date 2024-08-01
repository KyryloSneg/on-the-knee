function setQuestionCommentModalVisibility(isToShowModal, app) {
  app.setIsVisibleQuestionCommentModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setQuestionCommentModalVisibility;