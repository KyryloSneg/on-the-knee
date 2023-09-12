import { useState, useRef } from "react";
import FilterCategoryBtn from "./FilterCategoryBtn"
import CategoryFilterList from "./CategoryFilterList";
import PriceCategoryFilter from "./PriceCategoryFilter";
import "./styles/FilterCategoryBlock.css";

const FilterCategoryBlock = ({ filter, variant = "default", isFirst = false }) => {
  const [visible, setVisible] = useState(true);

  const elemToFocusRef = useRef(null);
  let className = "filter-category-block";

  let testId = `filter-category-block ${filter}`;
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
    <div className={className} data-testid={testId}>
      <FilterCategoryBtn
        filter={filter}
        visible={visible}
        setVisible={setVisible}
        isFirst={isFirst}
      />
      {renderFilters()}
    </div>
  );
}

export default FilterCategoryBlock;
