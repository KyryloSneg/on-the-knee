function setSelfDeliveryModalVisibility(isToShowModal, app) {
  // we close all windows on opening this modal
  app.setIsVisibleSelfDeliveryModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setSelfDeliveryModalVisibility;