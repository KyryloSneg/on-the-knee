import { useContext, useState } from "react";
import { Context } from "../Context";
import CategoryFilter from "./CategoryFilter";
import "./styles/CategoryFilterList.css";
import { observer } from "mobx-react-lite";
import SearchField from "./UI/searchField/SearchField";
import ArrayActions from "../utils/ArrayActions";

const CategoryFilterList = observer(({ filter, variant, elemToFocusRef = null }) => {
  const { deviceStore } = useContext(Context);
  const isWithSearchField = variant === "withSearchField";
  const [query, setQuery] = useState("");

  const [filteredValues, setFilteredValues] = useState(deviceStore.filters[filter]);
  let testId = `CategoryFilterList: ${filter.toLowerCase()}`;

  function renderFilters() {
    let filters = [];
    const sortedValues = ArrayActions.sortAlphaNumObjectArray(filteredValues.slice(), "value");

    // info contains such fields as "value" and "count"
    sortedValues.forEach(info => {
      
      let active = false;
      if (deviceStore.usedFilters?.[filter]) {
        const valueToCheck = filter === "color" ? info.value.split("#")[0] : info.value;
        active = deviceStore.usedFilters[filter].includes(valueToCheck);
      }
      
      const testId = `${filter}: ${info.value} checked=${active}`;
      filters.push(
        <li key={`${filter}: ${info.value}`}>
          <CategoryFilter
            filter={filter}
            value={info.value}
            count={info.count}
            active={active}
            testId={testId}
          />
        </li>
      );
    })

    return filters;
  }

  if (isWithSearchField) {
    return (
      <div className="filters-search-field-wrap">
        <SearchField
          query={query}
          setQuery={setQuery}
          setFilteredValues={setFilteredValues}
          filter={filter}
          initialFilters={deviceStore.filters[filter]}
          ref={elemToFocusRef}
        />
        <ul className="filters use-preety-scrollbar" data-testid={testId}>
          {filteredValues.length !== 0
            ? (
              renderFilters()
            )
            : (
              <p className="empty-filters-msg">
                We can't find such a filters
              </p>
            )
          }
        </ul>
      </div>
    );
  }

  return (
    <ul className="filters use-preety-scrollbar" data-testid={testId}>
      {filteredValues.length !== 0
        ? (
          renderFilters()
        )
        : (
          <p className="empty-filters-msg">
            We can't find such a filters
          </p>
        )
      }
    </ul>
  );
});

export default CategoryFilterList;
