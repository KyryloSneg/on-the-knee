import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setRemainSellerDevFeedbackModalVisibility(isToShowModal, app) {
  app.setIsVisibleRemainSellerDeviceFeedbackModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  // do not ask anything about this code
  // (making open of the reply modal from this one possible without any bugs)
  if (getIsVisibleMultipleWindows()) return;
  else {
    setTimeout(() => {
      const firstWindow = document.querySelectorAll(".window").item(0);
      if (getIsVisibleMultipleWindows() || firstWindow?.id === "reply-modal") return;

      app.setDarkBgVisible(isToShowModal);
      app.setIsBlockedScroll(isToShowModal);
    }, 0);
  }
}

export default setRemainSellerDevFeedbackModalVisibility;