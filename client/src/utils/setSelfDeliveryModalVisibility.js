function setSelfDeliveryModalVisibility(isToShowModal, app) {
  app.setIsVisibleSelfDeliveryModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setSelfDeliveryModalVisibility;