import { useContext } from "react";
import dropdownArrowIcon from "../assets/expand_more.svg";
import StringActions from "../utils/StringActions";
import "./styles/FilterCategoryBtn.css";
import { Context } from "../Context";

const FilterCategoryBtn = ({ filter, visible, setVisible, isFirst = false }) => {
  const { app, deviceStore } = useContext(Context);

  function onClick() {
    const nextVisible = !visible;
    setVisible(nextVisible);
  }

  if (isFirst && Object.keys(deviceStore.usedFilters).length === 0) {
    return (
      <button 
        onClick={onClick}
        data-testid={`CategoryBlockBtn: ${filter}`} 
        ref={app.asideBeginningRef}
      >
        <p>{StringActions.capitalize(filter)}</p>
        <img src={dropdownArrowIcon} alt="" className={visible ? "rotated" : ""} draggable="false" />
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      data-testid={`CategoryBlockBtn: ${filter}`}>
      <p>{StringActions.capitalize(filter)}</p>
      <img src={dropdownArrowIcon} alt="" className={visible ? "rotated" : ""} draggable="false" />
    </button>
  );
}

export default FilterCategoryBtn;
