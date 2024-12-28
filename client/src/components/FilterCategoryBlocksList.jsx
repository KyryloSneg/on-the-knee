import "./styles/FilterCategoryBlocksList.css";
import { observer } from "mobx-react-lite";
import FilterCategoryBlock from "./FilterCategoryBlock";
import { FILTERS_OPTIONS_LENGTH_LIMIT, SPECIAL_TO_HANDLE_FILTERS } from "../utils/consts";
import ArrayActions from "../utils/ArrayActions";

const FilterCategoryBlocksList = observer(({ storeToUse, areInitiallyVisible }) => {
  function renderList() {
    let result = [];

    const specialToHandleFiltersKeys = Object.keys(storeToUse.filters).filter(key => SPECIAL_TO_HANDLE_FILTERS.includes(key));
    // special filters + common ones 
    const sortedFilterKeys = specialToHandleFiltersKeys.concat(
      ArrayActions.sortStringArray(Object.keys(storeToUse.filters).filter(
        key => !SPECIAL_TO_HANDLE_FILTERS.includes(key)
      ))
    );

    sortedFilterKeys.forEach((filterKey) => {
      const isTooLong = storeToUse.filters[filterKey].length > FILTERS_OPTIONS_LENGTH_LIMIT;

      result.push(
        <li key={filterKey}>
          <FilterCategoryBlock
            filter={filterKey}
            variant={isTooLong ? "withSearchField" : "default"}
            storeToUse={storeToUse}
            isInitiallyVisible={areInitiallyVisible}
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
          storeToUse={storeToUse}
          isInitiallyVisible={areInitiallyVisible}
        />
      </li>
      {renderList()}
    </ul>
  );
});

export default FilterCategoryBlocksList;
