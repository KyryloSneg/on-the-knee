function setCartModalVisibility(isToShowModal, app) {
  app.setIsVisibleCartModal(isToShowModal);
  app.setDarkBgVisible(isToShowModal);
  app.setIsBlockedScroll(isToShowModal);

  if (!isToShowModal && app.cartModalBtnRef?.current) app.cartModalBtnRef?.current?.focus();
}

export default setCartModalVisibility;