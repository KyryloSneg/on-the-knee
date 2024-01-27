import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setFiltersSidebarVisibility(isToShowSidebar, app) {
  app.setIsVisibleFiltersSidebar(isToShowSidebar, app);
  if (getIsVisibleMultipleWindows()) return;

  app.setDarkBgVisible(isToShowSidebar, app);
  app.setIsBlockedScroll(isToShowSidebar, app);
}

export default setFiltersSidebarVisibility;