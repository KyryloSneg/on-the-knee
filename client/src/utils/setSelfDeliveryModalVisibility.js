function setSelfDeliveryModalVisibility(isToShowModal, app) {
  app.setIsVisibleSelfDeliveryModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setSelfDeliveryModalVisibility;