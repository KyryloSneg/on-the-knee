import { useContext } from "react";
import removeIcon from "../assets/remove.svg";
import { Context } from "../index";
import "./styles/FilterBtn.css";

const FilterBtn = ({ value, paramKey }) => {
  const { filtersStore } = useContext(Context);

  function onClick() {
    let nextFilters;

    if (filtersStore.filters[paramKey].length !== 1) {
      nextFilters = {
        ...filtersStore.filters,
        [paramKey]: filtersStore.filters[paramKey].filter(f => f !== value)
      }
    } else {
      const filtersClone = {...filtersStore.filters};
      delete filtersClone[paramKey];
      nextFilters = filtersClone;
    }

    console.log(nextFilters);

    filtersStore.setFilters(nextFilters);
  }

  return (
    <button className="remove-filter" onClick={onClick}>
      {value}
      <img src={removeIcon} className="no-select" draggable="false" alt="" />
    </button>
  );
}

export default FilterBtn;
