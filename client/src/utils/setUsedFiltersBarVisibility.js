import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setUsedFiltersBarVisibility(isToShowSidebar, app) {
  app.setIsVisibleUsedFiltersSidebar(isToShowSidebar, app);
  if (isToShowSidebar) app.setIsToSetLastBtnRefInCurrWindow(true);

  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowSidebar, app);
  app.setIsBlockedScroll(isToShowSidebar, app);
}

export default setUsedFiltersBarVisibility;