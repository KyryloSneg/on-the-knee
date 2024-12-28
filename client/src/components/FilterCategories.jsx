import "./styles/FilterCategories.css";
import FilterCategoryBlocksList from "./FilterCategoryBlocksList";

const FilterCategories = ({ storeToUse, areInitiallyVisible = true, isSidebarVersion = false }) => {
  let className = "filter-categories";
  if (isSidebarVersion) {
    className += ` sidebar-version`
  }

  return (
    <section className={className}>
      {!isSidebarVersion && <h2>Select filters</h2>}
      <FilterCategoryBlocksList areInitiallyVisible={areInitiallyVisible} storeToUse={storeToUse} />
    </section>
  );
};

export default FilterCategories;
