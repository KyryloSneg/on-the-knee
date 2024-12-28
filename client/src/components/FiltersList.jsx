import FilterBtn from "./FilterBtn";
import { observer } from "mobx-react-lite";
import RemoveAllFilterBtn from "./RemoveAllFilterBtn";

const FiltersList = observer(({ storeToUse }) => {
  function renderFilterBtns() {
    let result = [];

    for (let paramKey in storeToUse.usedFilters) {
      for (let value of storeToUse.usedFilters[paramKey]) {
        result.push(
          <li key={`${paramKey}: ${value}`}>
            <FilterBtn value={value} paramKey={paramKey} testId={`filter-btn ${paramKey}: ${value}`} />
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
