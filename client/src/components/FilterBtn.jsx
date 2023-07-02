import { useContext } from "react";
import removeIcon from "../assets/remove.svg";
import { Context } from "../Context";
import "./styles/FilterBtn.css";
import { nextRemovedFilters } from "../utils/filterFunctions";

const FilterBtn = ({ value, paramKey }) => {
  const { deviceStore } = useContext(Context);

  function onClick() {
    const nextFilters = nextRemovedFilters(deviceStore.usedFilters, paramKey, value);
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
