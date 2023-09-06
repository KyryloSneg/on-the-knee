import { forwardRef } from "react";
import SortingFilterBtn from "./SortingFilterBtn";

const DropdownBtn = forwardRef(({ variant, value, onClick, visible, paramKey, dropdownOptionsId }, ref) => {
  if (variant === "default-select") {
    // TODO: default dropdown menu 
    return (
      <div value={value} key={dropdownOptionsId} />
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
