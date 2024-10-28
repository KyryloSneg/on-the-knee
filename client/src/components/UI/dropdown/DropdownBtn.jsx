import "./DropdownBtn.css";
import { forwardRef } from "react";
import SortingFilterBtn from "./SortingFilterBtn";
import sortIcon from "../../../assets/sort.svg";
import dropdownArrowIcon from "../../../assets/expand_more.svg";
import UIButton from "../uiButton/UIButton";

const DropdownBtn = forwardRef(({ variant, value, onClick, visible, dropdownOptionsId, isWithFilterIcon }, ref) => {
  if (variant === "default-select") {
    let className = "dropdown-default-select-btn";
    if (visible) {
      className += " active";
    }

    return (
      <UIButton
        variant="primary2"
        hasIcon={true}
        onClick={onClick}
        aria-controls={dropdownOptionsId}
        className={className}
        ref={ref}
      >
        {isWithFilterIcon && <img src={sortIcon} alt="" draggable="false" />}
        <span>{value || "..."}</span>
        <img src={dropdownArrowIcon} alt="" draggable="false" className={visible ? "rotated" : ""} />
      </UIButton>
    );
  }

  if (variant === "sorting-filter") {
    return (
      <SortingFilterBtn
        value={value}
        onClick={onClick}
        visible={visible}
        ref={ref}
        dropdownOptionsId={dropdownOptionsId}
      />
    );
  }
});

export default DropdownBtn;
