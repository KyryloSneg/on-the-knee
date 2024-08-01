function setAnswerModalVisibility(isToShowModal, app, isOpenedFromGallery = false) {
  app.setIsVisibleAnswerModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(!isOpenedFromGallery);
}

export default setAnswerModalVisibility;