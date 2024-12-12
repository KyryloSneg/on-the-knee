function setReplyModalVisibility(isToShowModal, app, isOpenedFromModal = false) {
  app.setIsVisibleReplyModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(!isOpenedFromModal);
}

export default setReplyModalVisibility;