import "./styles/FilterCategories.css";
import FilterCategoryBlocksList from "./FilterCategoryBlocksList";

const FilterCategories = () => {
  return (
    <section className="filter-categories">
      <h2>Select filters</h2>
      <FilterCategoryBlocksList />
    </section>
  );
};

export default FilterCategories;
