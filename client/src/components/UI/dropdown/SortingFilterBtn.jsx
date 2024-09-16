import sortIcon from "../../../assets/sort.svg";
import dropdownArrowIcon from "../../../assets/expand_more.svg";
import "./SortingFilterBtn.css";
import { forwardRef } from "react";

const SortingFilterBtn = forwardRef(({ value, onClick, visible, dropdownOptionsId }, ref) => {
  return (
    <section className="sorting-filter-btn-wrap">
      <div className="sort-paragraph">
        <img src={sortIcon} alt="" className="no-select" draggable="false" />
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
        <img src={dropdownArrowIcon} className={visible ? "rotated" : ""} alt="" draggable="false" />
      </button>
    </section>
  );
});

export default SortingFilterBtn;
