import showCategoriesIcon from "../assets/show-categories-select.svg";
import usedFiltersIcon from "../assets/used-filters-shortcut.svg";
import "./styles/TopFilterBar.css";

const TopFilterBar = () => {

  function showCategories() {
    // open sidebar that contains various categories with simple animation
  }

  function showUsedFilters() {
    // open sidebar that contains used filters with simple animation
  }

  return (
    <section id="top-filter-bar">
      <button className="show-categories-select" onClick={showCategories}>
        <img src={showCategoriesIcon} alt="" />
        Filter selection
      </button>
      <button className="used-filters-shortcut" onClick={showUsedFilters}>
        <img src={usedFiltersIcon} alt="" />
        Used filters
      </button>
    </section>
  );
}

export default TopFilterBar;
