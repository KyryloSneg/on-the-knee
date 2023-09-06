import sortIcon from "../../../assets/sort.svg";
import dropdownArrowIcon from "../../../assets/expand_more.svg";
import "./SortingFilterBtn.css";
import { forwardRef } from "react";

const SortingFilterBtn = forwardRef(({ value, onClick, visible, dropdownOptionsId }, ref) => {
  return (
    <section className="sorting-filter-btn-wrap">
      <img src={sortIcon} alt="" className="no-select" draggable="false" />
      <p>Sort by:</p>
      <button 
        onClick={onClick} 
        data-testid="dropdown-sorting-filter-btn" 
        aria-controls={dropdownOptionsId}
        ref={ref} 
        className={visible ? "active" : ""}
      >
        <span>{value || "none"}</span>
        <img src={dropdownArrowIcon} className={visible ? "rotated" : ""} alt="" />
      </button>
    </section>
  );
});

export default SortingFilterBtn;
