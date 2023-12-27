import Navbar from "./components/Navbar";
import "./App.css";
import MyFooter from "./components/MyFooter";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "./Context";
import { observer } from "mobx-react-lite";
import getAllFocusableElements from "./utils/getAllFocusableElements";
import Sidebar from "./components/UI/sidebar/Sidebar";
import FilterCategories from "./components/FilterCategories";
import UsedFilters from "./components/UsedFilters";
import useWindowWidth from "./hooks/useWindowWidth";
import useClosingFiltersSidebarWidth from "./hooks/useClosingFiltersSidebarWidth";
import useClosingUsedFiltersBarWidth from "./hooks/useClosingUsedFiltersBarWidth";
import useClosingFiltersBarEmptyValue from "./hooks/useClosingFiltersBarEmptyValue";
import useClosingUsedFiltersBarValue from "./hooks/useClosingUsedFiltersBarValue";
import useBlockingScroll from "./hooks/useBlockingScroll";
 
const App = observer(() => {
  const { app, deviceStore } = useContext(Context);
  // ref for the "skip to next page content" btn
  const headerRef = useRef(null);
  const windowWidth = useWindowWidth();

  let pageElemToFocus;
  if (app.pageRef?.current) {
    pageElemToFocus = getAllFocusableElements(app.pageRef.current)[0];
  }

  const closeFiltersSidebar = useCallback(() => {
    app.setDarkBgVisible(false);
    app.setIsBlockedScroll(false);
    app.setIsVisibleFiltersSidebar(false);
  }, [app]);

  const closeUsedFiltersSidebar = useCallback(() => {
    app.setDarkBgVisible(false);
    app.setIsBlockedScroll(false);
    app.setIsVisibleUsedFiltersSidebar(false);
  }, [app]);

  useEffect(() => {
    app.setHeaderRef(headerRef);
  }, [app, headerRef]);

  useClosingFiltersSidebarWidth(windowWidth, app.isVisibleFiltersSidebar, closeFiltersSidebar);
  useClosingUsedFiltersBarWidth(windowWidth, app.isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar);

  useClosingFiltersBarEmptyValue(deviceStore.filters, app.isVisibleFiltersSidebar, closeFiltersSidebar);
  useClosingUsedFiltersBarValue(deviceStore.usedFilters, app.isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar);

  useBlockingScroll(app.isBlockedScroll);
  return (
    <div>
      {/* our gray bg on global loading */}
      {app.isGlobalLoading &&
        <div id="app-global-loading-bg" />
      }
      {/* our global loading loader bar */}
      {app.isGlobalLoading &&
        <div className="app-global-loading-bar">
          {/* rectangle that moves along the bar */}
          <div className="app-global-loading-bar-rect" />
          <span className="visually-hidden">Loading...</span>
        </div>
      }
      {/* dark bg that shows up on certain events (like opening a modal window) */}
      {app.darkBgVisible && <div id="app-dark-bg" tabIndex={0} data-testid="app-dark-bg" />}
      {app.isVisibleFiltersSidebar &&
        <Sidebar
          children={<FilterCategories areInitiallyVisible={false} isSidebarVersion={true} />}
          closeSidebar={closeFiltersSidebar}
          headerText="Filters"
        />
      }
      {app.isVisibleUsedFiltersSidebar &&
        <Sidebar
          children={<UsedFilters isSidebarVersion={true} />}
          closeSidebar={closeUsedFiltersSidebar}
          headerText="Used filters"
        />
      }
      <header ref={headerRef}>
        <Navbar elemToFocus={pageElemToFocus} />
      </header>
      <Outlet />
      <MyFooter />
    </div>
  );
});

export default App;
