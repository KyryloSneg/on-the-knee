import dropdownArrowIcon from "../assets/expand_more.svg";
import StringActions from "../utils/StringActions";
import "./styles/FilterCategoryBtn.css";

const FilterCategoryBtn = ({ filter, visible, setVisible }) => {
  const filterName = StringActions.capitalize(StringActions.splitByUpperCaseLetters(filter));

  function onClick() {
    const nextVisible = !visible;
    setVisible(nextVisible);
  }

  return (
    <button 
      onClick={onClick}
      data-testid={`CategoryBlockBtn: ${filter}`}>
      <p>{filterName}</p>
      <img src={dropdownArrowIcon} alt="" className={visible ? "rotated" : ""} draggable="false" />
    </button>
  );
}

export default FilterCategoryBtn;
