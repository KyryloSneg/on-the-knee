function setReplyModalVisibility(isToShowModal, app, isOpenedFromGallery = false) {
  app.setIsVisibleReplyModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(!isOpenedFromGallery);
}

export default setReplyModalVisibility;