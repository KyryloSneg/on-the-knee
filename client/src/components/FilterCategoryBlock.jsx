import { useState, useRef } from "react";
import FilterCategoryBtn from "./FilterCategoryBtn"
import CategoryFilterList from "./CategoryFilterList";
import "./styles/FilterCategoryBlock.css";

const FilterCategoryBlock = ({ filter, filterCategoryBlockId,  }) => {
  const [visible, setVisible] = useState(true);
  const optionRefs = useRef([]);
  const [selectedByKeyboardId, setSelectedByKeyboardId] = useState(0);
  const ulRef = useRef(null);
  const [ulClassName, setUlClassName] = useState("filters");

  return (
    <div className={"filter-category-block"}>
      <FilterCategoryBtn 
        filter={filter} 
        visible={visible} 
        setVisible={setVisible} 
        ulRef={ulRef} 
        optionRefs={optionRefs}
        selectedByKeyboardId={selectedByKeyboardId}
        filterCategoryBlockId={filterCategoryBlockId}
        setUlClassName={setUlClassName}
      />
      <CategoryFilterList 
        filter={filter} 
        ref={ulRef} 
        optionRefs={optionRefs} 
        selectedByKeyboardId={selectedByKeyboardId} 
        setSelectedByKeyboardId={setSelectedByKeyboardId}
        filterCategoryBlockId={filterCategoryBlockId}
        className={ulClassName}
      />
    </div>
  );
}

export default FilterCategoryBlock;
