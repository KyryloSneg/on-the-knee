import { useContext } from "react";
import { Context } from "../index";
import FilterBtn from "./FilterBtn";
import { observer } from "mobx-react-lite";
import RemoveAllFilterBtn from "./RemoveAllFilterBtn";

const FiltersList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderFilterBtns() {
    let result = [];

    for (let paramKey in deviceStore.usedFilters) {
      for (let value of deviceStore.usedFilters[paramKey]) {
        result.push(
          <li key={`${paramKey}: ${value}`}>
            <FilterBtn value={value} paramKey={paramKey} />
          </li>
        );
      }
    }

    return result;
  }

  return (
    <ul>
      <RemoveAllFilterBtn />
      {renderFilterBtns()}
    </ul>
  );
});

export default FiltersList;
