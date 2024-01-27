function setMenuVisibility(isToShowMenu, app) {
  app.setDarkBgVisible(isToShowMenu);
  app.setIsBlockedScroll(isToShowMenu);
  app.setIsVisibleMenu(isToShowMenu);
}

export default setMenuVisibility;