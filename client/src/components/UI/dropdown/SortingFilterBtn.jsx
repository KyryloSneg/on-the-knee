import "./SortingFilterBtn.css";
import sortIcon from "../../../assets/sort.svg";
import { forwardRef } from "react";
import DropdownArrow from "../dropdownArrow/DropdownArrow";

const SortingFilterBtn = forwardRef(({ value, onClick, visible, dropdownOptionsId }, ref) => {
  return (
    <section className="sorting-filter-btn-wrap">
      <div className="sort-paragraph">
        <img src={sortIcon} alt="" draggable="false" />
        <p>Sort by:</p>
      </div>
      <button 
        type="button"
        onClick={onClick} 
        data-testid="dropdown-sorting-filter-btn" 
        aria-controls={dropdownOptionsId}
        className={visible ? "active" : ""}
        ref={ref} 
      >
        <span>{value || "..."}</span>
        <DropdownArrow isExpanded={visible} />
      </button>
    </section>
  );
});

export default SortingFilterBtn;
