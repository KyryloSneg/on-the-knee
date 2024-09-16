function setWrongCartComboAmountsModalVisibility(isToShowModal, app) {
  app.setIsVisibleWrongCartComboAmountsModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);
}

export default setWrongCartComboAmountsModalVisibility;