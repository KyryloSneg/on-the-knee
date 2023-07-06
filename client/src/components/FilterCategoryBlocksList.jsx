import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import FilterCategoryBlock from "./FilterCategoryBlock";
import { FILTERS_OPTIONS_LENGTH_LIMIT } from "../utils/consts";

const FilterCategoryBlocksList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderList() {
    let result = [];

    for (let filterKey in deviceStore.filters) {
      const isTooLong = deviceStore.filters[filterKey].length >= FILTERS_OPTIONS_LENGTH_LIMIT;

      result.push(
        <li key={filterKey}>
          <FilterCategoryBlock
            filter={filterKey}
            filterCategoryBlockId={`${Object.keys(deviceStore.filters).findIndex(key => key === filterKey)}`}
            variant={isTooLong ? "withSearchField" : "default"}
          />
        </li>
      );
    }

    return result;
  }

  return (
    <ul>
      <li>
        <FilterCategoryBlock
          filter="price"
          filterCategoryBlockId="price"
          variant="price"
        />
      </li>
      {renderList()}
    </ul>
  );
});

export default FilterCategoryBlocksList;
