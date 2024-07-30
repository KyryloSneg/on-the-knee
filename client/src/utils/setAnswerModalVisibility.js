function setAnswerModalVisibility(isToShowModal, app) {
  app.setIsVisibleAnswerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.answerModalBtnRef?.current) app.answerModalBtnRef?.current?.focus();
}

export default setAnswerModalVisibility;