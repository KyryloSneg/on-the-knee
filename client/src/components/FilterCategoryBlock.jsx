import { useState, useRef } from "react";
import FilterCategoryBtn from "./FilterCategoryBtn"
import CategoryFilterList from "./CategoryFilterList";
import PriceCategoryFilter from "./PriceCategoryFilter";
import "./styles/FilterCategoryBlock.css";

const initialPriceClass = "price-range-form-wrap use-preety-scrollbar";
const initialFiltersClass = "filters use-preety-scrollbar";

const FilterCategoryBlock = ({ filter, filterCategoryBlockId, variant="default" }) => {
  const [visible, setVisible] = useState(true);

  const optionRefs = useRef([]);
  const [selectedByKeyboardId, setSelectedByKeyboardId] = useState(0);

  const blockItemRef = useRef(null);
  const [blockItemClassName, setBlockItemClassName] = useState(variant === "price" ? initialPriceClass: initialFiltersClass);

  const elemToFocusRef = useRef(null);

  return (
    <div className={"filter-category-block"}>
      <FilterCategoryBtn 
        filter={filter} 
        visible={visible} 
        setVisible={setVisible} 
        blockItemRef={blockItemRef} 
        optionRefs={optionRefs}
        selectedByKeyboardId={selectedByKeyboardId}
        filterCategoryBlockId={filterCategoryBlockId}
        setBlockItemClassName={setBlockItemClassName}
        variant={variant}
        elemToFocusRef={elemToFocusRef}
      />
      {variant !== "price"
        ? (
          <CategoryFilterList 
            filter={filter} 
            ref={blockItemRef} 
            optionRefs={optionRefs} 
            selectedByKeyboardId={selectedByKeyboardId} 
            setSelectedByKeyboardId={setSelectedByKeyboardId}
            filterCategoryBlockId={filterCategoryBlockId}
            className={blockItemClassName}
            variant={variant}
            elemToFocusRef={elemToFocusRef}
          />
        )
        : (
          <PriceCategoryFilter
            className={blockItemClassName}
            minPriceRef={elemToFocusRef}
            ref={blockItemRef}
          />
        )
      }

    </div>
  );
}

export default FilterCategoryBlock;
