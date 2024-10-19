function setReportOrderProblemModalVisibility(isToShowModal, app) {
  app.setIsVisibleReportOrderProblemModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (isToShowModal) {
    app.setIsToSetLastBtnRefInCurrWindow(true);
  } else {
    // resetting the orderId
    app.setReportOrderProblemOrderId(null);
  }
}

export default setReportOrderProblemModalVisibility;