import { forwardRef } from "react";
import SortingFilterBtn from "./SortingFilterBtn";

const DropdownBtn = forwardRef(({ variant, value, onClick, visible }, ref) => {
  if (variant === "default-select") {
    // TODO: default dropdown menu 
    return (
      <div value={value}></div>
    );
  }

  if (variant === "sorting-filter") {
    return (
      <SortingFilterBtn value={value} onClick={onClick} visible={visible} ref={ref} />
    );
  }
});

export default DropdownBtn;
