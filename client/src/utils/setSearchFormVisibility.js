import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setSearchFormVisibility(isToShowSidebar, app) {
  app.setIsFocusedSearchForm(isToShowSidebar, app);
  if (isToShowSidebar) {
    app.navBtnGroupRef.current.classList.add("focusedSearch");
  } else {
    app.navBtnGroupRef.current.classList.remove("focusedSearch");
  }
  
  if (getIsVisibleMultipleWindows()) return;
  app.setDarkBgVisible(isToShowSidebar, app);
}

export default setSearchFormVisibility;