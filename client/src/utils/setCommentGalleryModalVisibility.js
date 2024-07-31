import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setCommentGalleryModalVisibility(isToShowModal, app, isToKeepDarkBg = false) {
  app.setIsVisibleCommentGalleryModal(isToShowModal);
  if (isToShowModal) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows() || isToKeepDarkBg) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  // if (!isToShowModal && app.commentGalleryModalBtnRef?.current) app.commentGalleryModalBtnRef?.current?.focus();
}

export default setCommentGalleryModalVisibility;