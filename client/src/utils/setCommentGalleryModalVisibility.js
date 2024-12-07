import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setCommentGalleryModalVisibility(isToShowModal, app, isToKeepDarkBg = false, btnRef = null) {
  app.setIsVisibleCommentGalleryModal(isToShowModal);

  if (isToShowModal) {
    app.setIsToSetLastBtnRefInCurrWindow(true);
  } else if (btnRef) {
    btnRef?.current?.focus?.();
  }

  if (getIsVisibleMultipleWindows() || isToKeepDarkBg) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  // if (!isToShowModal && app.commentGalleryModalBtnRef?.current) app.commentGalleryModalBtnRef?.current?.focus();
}

export default setCommentGalleryModalVisibility;