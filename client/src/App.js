import Navbar from "./components/Navbar";
import "./App.css";
import "./styles/ReactCustomScroll.css";
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
import CategoriesMenu from "./components/CategoriesMenu";
import useInitialDataFetching from "./hooks/useInitialDataFetching";
import useClosingCategoriesMenuWidth from "./hooks/useClosingCategoriesMenuWidth";
import Menu from "./components/Menu";
import setMenuVisibility from "./utils/setMenuVisibility";
import setCategoriesModalVisibility from "./utils/setCategoriesModalVisibility";
import ModalWindow from "./components/UI/modalWindow/ModalWindow";
import CategoriesModalContent from "./components/CategoriesModalContent";
import setFiltersSidebarVisibility from "./utils/setFiltersSidebarVisibility";
import setUsedFiltersBarVisibility from "./utils/setUsedFiltersBarVisibility";
import useClosingCategoriesModalWidth from "./hooks/useClosingCategoriesModalWidth";
 
const App = observer(() => {
  const { app, deviceStore } = useContext(Context);
  // ref for the "skip to next page content" btn
  const headerRef = useRef(null);
  const navCategoryBtnRef = useRef(null);
  const windowWidth = useWindowWidth();

  let pageElemToFocus;
  if (app.pageRef?.current) {
    pageElemToFocus = getAllFocusableElements(app.pageRef.current)[0];
  }

  const closeFiltersSidebar = useCallback(() => {
    setFiltersSidebarVisibility(false, app)
  }, [app]);

  const closeUsedFiltersSidebar = useCallback(() => {
    setUsedFiltersBarVisibility(false, app);
  }, [app]);

  function setIsCategoriesModalVisible(isVisible) {
    setCategoriesModalVisibility(isVisible, app);
  }

  function closeMenuSidebar() {
    setMenuVisibility(false, app);
  }

  useEffect(() => {
    app.setHeaderRef(headerRef);
  }, [app, headerRef]);

  useInitialDataFetching();

  useClosingFiltersSidebarWidth(windowWidth, app.isVisibleFiltersSidebar, closeFiltersSidebar);
  useClosingUsedFiltersBarWidth(windowWidth, app.isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar);
  useClosingCategoriesMenuWidth(windowWidth, app.isVisibleCategoriesMenu, app);
  useClosingCategoriesModalWidth(windowWidth, app.isVisibleCategoriesModal, app);

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
      {app.darkBgVisible && <div id="app-dark-bg" className="visible" tabIndex={0} data-testid="app-dark-bg" />}
      {app.isVisibleMenu &&
        <Sidebar
          children={<Menu />}
          closeSidebar={closeMenuSidebar}
          shortcutRef={app.menuShortcutRef}
          headerText="Menu"
          id="menu-sidebar"
        />
      }
      {app.isVisibleFiltersSidebar &&
        <Sidebar
          children={<FilterCategories areInitiallyVisible={false} isSidebarVersion={true} />}
          closeSidebar={closeFiltersSidebar}
          shortcutRef={app.filtersShortcutRef}
          headerText="Filters"
          id="filter-categories-sidebar"
        />
      }
      {app.isVisibleUsedFiltersSidebar &&
        <Sidebar
          children={<UsedFilters isSidebarVersion={true} />}
          closeSidebar={closeUsedFiltersSidebar}
          shortcutRef={app.usedFiltersShortcutRef}
          headerText="Used filters"
          id="used-filters-sidebar"
        />
      }
      <ModalWindow
        isVisible={app.isVisibleCategoriesModal} 
        setIsVisible={setIsCategoriesModalVisible}
        children={<CategoriesModalContent />}
        headerText="Categories"
        id="categories-modal"
      />
      <header ref={headerRef}>
        <Navbar elemToFocus={pageElemToFocus} navCategoryBtnRef={navCategoryBtnRef} />
        {(app.isVisibleCategoriesMenu && !!Object.keys(deviceStore.categories).length) && 
          <CategoriesMenu navCategoryBtnRef={navCategoryBtnRef} />
        }
      </header>
      <Outlet />  
      <MyFooter />
    </div>
  );
});

export default App;
