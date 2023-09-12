import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import FilterCategoryBlock from "./FilterCategoryBlock";
import { FILTERS_OPTIONS_LENGTH_LIMIT } from "../utils/consts";
import ArrayActions from "../utils/ArrayActions";

const FilterCategoryBlocksList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderList() {
    let result = [];
    const sortedFilterKeys = ArrayActions.sortStringArray(Object.keys(deviceStore.filters));

    sortedFilterKeys.forEach((filterKey, index) => {
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
          isFirst={true}
        />
      </li>
      {renderList()}
    </ul>
  );
});

export default FilterCategoryBlocksList;
