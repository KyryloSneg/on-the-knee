import "./styles/FilterCategoryBtn.css";
import StringActions from "../utils/StringActions";
import DropdownArrow from "./UI/dropdownArrow/DropdownArrow";

const FilterCategoryBtn = ({ filter, visible, setVisible }) => {
  const filterName = StringActions.capitalize(StringActions.splitByUpperCaseLetters(filter));

  function onClick() {
    const nextVisible = !visible;
    setVisible(nextVisible);
  }

  return (
    <button 
      onClick={onClick}
      data-testid={`CategoryBlockBtn: ${filter}`}
    >
      <p>{filterName}</p>
      <DropdownArrow isExpanded={visible} />
    </button>
  );
}

export default FilterCategoryBtn;
