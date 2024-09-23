function setAuthentificationModalVisibility(isToShowModal, app) {
  app.setIsVisibleAuthentificationModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setAuthentificationModalVisibility;