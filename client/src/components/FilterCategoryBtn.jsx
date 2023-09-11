import dropdownArrowIcon from "../assets/expand_more.svg";
import StringActions from "../utils/StringActions";
import "./styles/FilterCategoryBtn.css";

const FilterCategoryBtn = ({ filter, visible, setVisible}) => {

  function onClick() {
    const nextVisible = !visible;
    setVisible(nextVisible);
  }

  return (
    <button onClick={onClick} data-testid={`CategoryBlockBtn: ${filter}`}>
      <p>{StringActions.capitalize(filter)}</p>
      <img src={dropdownArrowIcon} alt="" className={visible ? "rotated" : ""} draggable="false" />
    </button>
  );
}

export default FilterCategoryBtn;
