import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setCommentGalleryModalVisibility(isToShowModal, app, isToKeepDarkBg = false) {
  app.setIsVisibleCommentGalleryModal(isToShowModal);
  if (getIsVisibleMultipleWindows() || isToKeepDarkBg) return;

  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);
}

export default setCommentGalleryModalVisibility;