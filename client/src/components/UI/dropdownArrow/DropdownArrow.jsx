import dropdownArrowIcon from "../../../assets/expand_more.svg";

const DropdownArrow = ({ isExpanded }) => {
  return (
    <img
      src={dropdownArrowIcon}
      alt={isExpanded ? "Collapse" : "Expand"}
      className={isExpanded ? "rotated" : ""}
      draggable="false"
    />
  );
}

export default DropdownArrow;
