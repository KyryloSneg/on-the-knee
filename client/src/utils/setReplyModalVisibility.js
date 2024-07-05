function setReplyModalVisibility(isToShowModal, app) {
  app.setIsVisibleReplyModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setReplyModalVisibility;