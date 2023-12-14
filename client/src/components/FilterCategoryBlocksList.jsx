import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import FilterCategoryBlock from "./FilterCategoryBlock";
import { FILTERS_OPTIONS_LENGTH_LIMIT, SPECIAL_TO_HANDLE_FILTERS } from "../utils/consts";
import ArrayActions from "../utils/ArrayActions";

const FilterCategoryBlocksList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderList() {
    let result = [];

    const specialToHandleFiltersKeys = Object.keys(deviceStore.filters).filter(key => SPECIAL_TO_HANDLE_FILTERS.includes(key));
    // special filters + common ones 
    const sortedFilterKeys = specialToHandleFiltersKeys.concat(
      ArrayActions.sortStringArray(Object.keys(deviceStore.filters).filter(
        key => !SPECIAL_TO_HANDLE_FILTERS.includes(key)
      ))
    );

    sortedFilterKeys.forEach((filterKey) => {
      const isTooLong = deviceStore.filters[filterKey].length >= FILTERS_OPTIONS_LENGTH_LIMIT;

      result.push(
        <li key={filterKey}>
          <FilterCategoryBlock
            filter={filterKey}
            variant={isTooLong ? "withSearchField" : "default"}
          />
        </li>
      );
    });

    return result;
  }

  return (
    <ul>
      <li>
        <FilterCategoryBlock
          filter="price"
          variant="price"
        />
      </li>
      {renderList()}
    </ul>
  );
});

export default FilterCategoryBlocksList;
