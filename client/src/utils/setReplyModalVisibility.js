function setReplyModalVisibility(isToShowModal, app) {
  app.setIsVisibleReplyModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.replyModalBtnRef?.current) app.replyModalBtnRef?.current?.focus();
}

export default setReplyModalVisibility;