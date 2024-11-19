import "./DropdownBtn.css";
import { forwardRef } from "react";
import SortingFilterBtn from "./SortingFilterBtn";
import sortIcon from "../../../assets/sort.svg";
import UIButton from "../uiButton/UIButton";
import DropdownArrow from "../dropdownArrow/DropdownArrow";

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
        <DropdownArrow isExpanded={visible} />
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
