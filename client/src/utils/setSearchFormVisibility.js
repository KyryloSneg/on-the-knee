import getIsVisibleMultipleWindows from "./getIsVisibleMultipleWindows";

function setSearchFormVisibility(isToShowSidebar, app) {
  app.setIsFocusedSearchForm(isToShowSidebar, app);
  
  if (isToShowSidebar) {
    app.navBtnGroupRef?.current.classList.add("focusedSearch");
    app.headerRef?.current.classList.add("closer-than-darkbg");
  } else {
    app.navBtnGroupRef?.current.classList.remove("focusedSearch");
    app.headerRef?.current.classList.remove("closer-than-darkbg");
  }

  if (getIsVisibleMultipleWindows()) return;
  app.setDarkBgVisible(isToShowSidebar, app);
}

export default setSearchFormVisibility;