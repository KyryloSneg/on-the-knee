function setErrorModalVisibility(isToShowModal, app) {
  app.setIsVisibleErrorModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setErrorModalVisibility;