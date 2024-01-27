import { useContext, useEffect, useRef } from "react";
import showCategoriesIcon from "../assets/show-categories-select.svg";
import usedFiltersIcon from "../assets/used-filters-shortcut.svg";
import "./styles/TopFilterBar.css";
import { Context } from "../Context";
import setFiltersSidebarVisibility from "../utils/setFiltersSidebarVisibility";
import setUsedFiltersBarVisibility from "../utils/setUsedFiltersBarVisibility";
import { observer } from "mobx-react-lite";

const TopFilterBar = observer(() => {
  const { app, deviceStore } = useContext(Context);
  const filtersShortcutRef = useRef(null);
  const usedFiltersShortcutRef = useRef(null);

  useEffect(() => {
    app.setFiltersShortcutRef(filtersShortcutRef);
  }, [app]);

  useEffect(() => {
    app.setUsedFiltersShortcutRef(usedFiltersShortcutRef);
  }, [app]);

  function showCategories() {
    if (!Object.keys(deviceStore.filters).length) return;

    // open sidebar that contains various categories filters with simple animation
    setFiltersSidebarVisibility(true, app);
  }

  function showUsedFilters() {
    // open sidebar that contains used filters with simple animation
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
      {!!Object.keys(deviceStore.usedFilters).length &&
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
