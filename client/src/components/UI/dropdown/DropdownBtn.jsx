import SortingFilterBtn from "./SortingFilterBtn";

const DropdownBtn = ({ variant, placeHolder, value, onClick, visible }) => {
  if (variant === "default-select") {
    // TODO: default dropdown menu 
    return (
      <div placeHolder={placeHolder}></div>
    );
  }

  if (variant === "sorting-filter") {
    return (
      <SortingFilterBtn value={value} onClick={onClick} visible={visible} />
    );
  }
}

export default DropdownBtn;
