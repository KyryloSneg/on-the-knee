import { forwardRef, useContext } from "react";
import showCategoriesIcon from "../assets/show-categories-select.svg";
import usedFiltersIcon from "../assets/used-filters-shortcut.svg";
import "./styles/TopFilterBar.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

// we don't use "observer" because catalog page already has one
const TopFilterBar = observer(forwardRef((props, ref) => {
  const { app, deviceStore } = useContext(Context);

  function showCategories() {
    if (!Object.keys(deviceStore.filters).length) return;

    // open sidebar that contains various categories with simple animation
    app.setDarkBgVisible(true);
    app.setIsBlockedScroll(true);
    app.setIsVisibleFiltersSidebar(true);
  }

  function showUsedFilters() {
    // open sidebar that contains used filters with simple animation
    app.setDarkBgVisible(true);
    app.setIsBlockedScroll(true);
    app.setIsVisibleUsedFiltersSidebar(true);
  }

  return (
    <section id="top-filter-bar">
      <button className="show-categories-select" onClick={showCategories} ref={ref}>
        <img src={showCategoriesIcon} alt="" />
        Filter selection
      </button>
      {!!Object.keys(deviceStore.usedFilters).length &&
        <button className="used-filters-shortcut" onClick={showUsedFilters}>
          <img src={usedFiltersIcon} alt="" />
          Used filters
        </button>
      }
    </section>
  );
}));

export default TopFilterBar;
