function setSelfDeliveryModalVisibility(isToShowModal, app) {
  app.setIsVisibleSelfDeliveryModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.selfDeliveryModalBtnRef?.current) app.selfDeliveryModalBtnRef?.current?.focus();
}

export default setSelfDeliveryModalVisibility;