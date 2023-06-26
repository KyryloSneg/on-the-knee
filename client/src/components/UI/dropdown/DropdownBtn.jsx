import { forwardRef } from "react";
import SortingFilterBtn from "./SortingFilterBtn";

const DropdownBtn = forwardRef(({ variant, placeHolder, value, onClick, visible }, ref) => {
  if (variant === "default-select") {
    // TODO: default dropdown menu 
    return (
      <div placeHolder={placeHolder}></div>
    );
  }

  if (variant === "sorting-filter") {
    return (
      <SortingFilterBtn value={value} onClick={onClick} visible={visible} ref={ref} />
    );
  }
});

export default DropdownBtn;
