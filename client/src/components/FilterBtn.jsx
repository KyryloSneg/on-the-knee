import { useContext } from "react";
import removeIcon from "../assets/remove.svg";
import { Context } from "../index";
import "./styles/FilterBtn.css";

const FilterBtn = ({ value, paramKey }) => {
  const { deviceStore } = useContext(Context);

  function onClick() {
    let nextFilters;

    if (deviceStore.usedFilters[paramKey].length !== 1) {
      nextFilters = {
        ...deviceStore.usedFilters,
        [paramKey]: deviceStore.usedFilters[paramKey].filter(f => f !== value)
      }
    } else {
      const filtersClone = {...deviceStore.usedFilters};
      delete filtersClone[paramKey];
      nextFilters = filtersClone;
    }

    console.log(nextFilters);

    deviceStore.setUsedFilters(nextFilters);
  }

  return (
    <button className="remove-filter" onClick={onClick}>
      {value}
      <img src={removeIcon} className="no-select" draggable="false" alt="" />
    </button>
  );
}

export default FilterBtn;
