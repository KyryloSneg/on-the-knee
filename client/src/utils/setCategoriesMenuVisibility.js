import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setCategoriesMenuVisibility(isToShowMenu, app) {
  if (isToShowMenu) {
    app.headerRef?.current?.classList.add("closer-than-darkbg");
  } else {
    app.headerRef?.current?.classList.remove("closer-than-darkbg");
  }

  app.setIsVisibleCategoriesMenu(isToShowMenu);
  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowMenu);
}

export default setCategoriesMenuVisibility;