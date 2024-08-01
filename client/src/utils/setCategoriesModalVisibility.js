import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setCategoriesModalVisibility(isToShowModal, app) {
  app.setIsVisibleCategoriesModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setCategoriesModalVisibility;