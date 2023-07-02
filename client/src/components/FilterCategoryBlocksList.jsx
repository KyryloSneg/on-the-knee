import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../Context";
import FilterCategoryBlock from "./FilterCategoryBlock";

const FilterCategoryBlocksList = observer(() => {
  const { deviceStore } = useContext(Context);

  function renderList() {
    let result = [];

    for (let filterKey in deviceStore.filters) {
      result.push(
        <li key={filterKey}>
          <FilterCategoryBlock 
            filter={filterKey} 
            filterCategoryBlockId={`${Object.keys(deviceStore.filters).findIndex(key => key === filterKey)}`}
          />
        </li>
      );
    }

    return result;
  }

  return (
    <ul>
      {renderList()}
    </ul>
  );
});

export default FilterCategoryBlocksList;
