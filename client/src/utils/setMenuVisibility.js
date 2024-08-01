import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setMenuVisibility(isToShowMenu, app, isToKeepDarkBg = false) {
  // sometimes we have to use isToKeepDarkBg param to evade some bugs 
  // (atm of invoking getIsVisibleMultipleWindows function there could be no multiple windows and it's hard to fix i think),
  app.setIsVisibleMenu(isToShowMenu);
  if (isToShowMenu) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows() || isToKeepDarkBg) return;

  app.setDarkBgVisible(isToShowMenu);
  app.setIsBlockedScroll(isToShowMenu);
}

export default setMenuVisibility;