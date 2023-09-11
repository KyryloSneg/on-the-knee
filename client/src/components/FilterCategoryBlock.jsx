import { useState, useRef } from "react";
import FilterCategoryBtn from "./FilterCategoryBtn"
import CategoryFilterList from "./CategoryFilterList";
import PriceCategoryFilter from "./PriceCategoryFilter";
import "./styles/FilterCategoryBlock.css";

const FilterCategoryBlock = ({ filter, variant = "default" }) => {
  const [visible, setVisible] = useState(true);

  const elemToFocusRef = useRef(null);
  const className = "filter-category-block";

  let testId = `${className} ${filter}`;
  if (visible) {
    testId += " expanded";
  } else {
    testId += " collapsed";
  }

  function renderFilters() {
    if (visible) {

      if (variant !== "price") {
        return (
          <CategoryFilterList
            filter={filter}
            variant={variant}
            elemToFocusRef={elemToFocusRef}
          />
        );
      } else {
        return (
          <PriceCategoryFilter />
        );
      }

    }
  }

  return (
    <div className={"filter-category-block"} data-testid={testId}>
      <FilterCategoryBtn
        filter={filter}
        visible={visible}
        setVisible={setVisible}
      />
      {renderFilters()}
    </div>
  );
}

export default FilterCategoryBlock;
