import { useContext, useEffect, useRef } from "react";
import showCategoriesIcon from "../assets/show-categories-select.svg";
import usedFiltersIcon from "../assets/used-filters-shortcut.svg";
import "./styles/TopFilterBar.css";
import { Context } from "../Context";
import setFiltersSidebarVisibility from "../utils/setFiltersSidebarVisibility";
import setUsedFiltersBarVisibility from "../utils/setUsedFiltersBarVisibility";
import { observer } from "mobx-react-lite";

const TopFilterBar = observer(({ storeToUse }) => {
  const { app } = useContext(Context);
  const filtersShortcutRef = useRef(null);
  const usedFiltersShortcutRef = useRef(null);

  useEffect(() => {
    app.setFiltersShortcutRef(filtersShortcutRef);
  }, [app]);

  useEffect(() => {
    app.setUsedFiltersShortcutRef(usedFiltersShortcutRef);
  }, [app]);

  useEffect(() => {
    // returning to our btn ref after selecting / deleting a filter
    if (!!app.lastWindowBtnRef?.current 
      && (app.lastWindowBtnRef?.current === filtersShortcutRef.current
        || app.lastWindowBtnRef?.current === usedFiltersShortcutRef.current
      )
    ) app.lastWindowBtnRef?.current?.focus();
    // eslint-disable-next-line
  }, []);

  function showCategories() {
    if (!Object.keys(storeToUse.filters).length) return;

    // open sidebar that contains various categories filters with simple animation
    app.setFiltersRelatedSidebarsStoreToUse(storeToUse);
    setFiltersSidebarVisibility(true, app);
  }

  function showUsedFilters() {
    // open sidebar that contains used filters with simple animation
    app.setFiltersRelatedSidebarsStoreToUse(storeToUse);
    setUsedFiltersBarVisibility(true, app);
  }

  return (
    <section id="top-filter-bar">
      <button 
        className="show-categories-select" 
        onClick={showCategories}
        ref={filtersShortcutRef}
      >
        <img src={showCategoriesIcon} alt="" />
        Filter selection
      </button>
      {!!Object.keys(storeToUse.usedFilters).length &&
        <button 
          className="used-filters-shortcut" 
          onClick={showUsedFilters}
          ref={usedFiltersShortcutRef}
        >
          <img src={usedFiltersIcon} alt="" />
          Used filters
        </button>
      }
    </section>
  );
});

export default TopFilterBar;
