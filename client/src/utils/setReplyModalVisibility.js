function setReplyModalVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleReplyModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setReplyModalVisibility;