import "./styles/CategoryFilterList.css";
import { useEffect, useRef, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import { observer } from "mobx-react-lite";
import SearchField from "./UI/searchField/SearchField";
import ArrayActions from "../utils/ArrayActions";
import { FILTERS_OPTIONS_LENGTH_LIMIT } from "../utils/consts";
import getAllFocusableElements from "../utils/getAllFocusableElements";
import useWindowInvisibleFocus from "../hooks/useWindowInvisibleFocus";

const CategoryFilterList = observer(({ filter, variant, storeToUse, elemToFocusRef = null }) => {
  const isWithSearchField = variant === "withSearchField";

  const invisibleFocusElem = useRef(null);
  const filterListRef = useRef(null);
  const showMoreBtnRef = useRef(null);

  const [isToShowMore, setIsToShowMore] = useState(false);
  const [query, setQuery] = useState("");

  const [filteredValues, setFilteredValues] = useState(storeToUse.filters[filter]);
  let testId = `CategoryFilterList: ${filter.toLowerCase()}`;

  function showMoreFilters() {
    setIsToShowMore(!isToShowMore);
  }

  useEffect(() => {
    setQuery("");
    setFilteredValues(storeToUse.filters[filter])
  }, [storeToUse.filters, filter]);

  useEffect(() => {
    if (document.activeElement === showMoreBtnRef.current && document.activeElement !== null) {
      const filtersElems = getAllFocusableElements(filterListRef.current);

      if (isToShowMore) {
        invisibleFocusElem.current = filtersElems[6];
      } else {
        invisibleFocusElem.current = null;
      }
    }
  }, [isToShowMore]);

  useWindowInvisibleFocus(invisibleFocusElem, true, isToShowMore);

  function renderFilters() {
    let filters = [];
    const sortedValues = ArrayActions.sortAlphaNumObjectArray(filteredValues.slice(), "value");

    // info contains such fields as "value" and "count"
    function pushFilter(info) {
      let active = false;
      if (storeToUse.usedFilters?.[filter]) {
        const valueToCheck = filter === "color" ? info.value.split("_")[0] : info.value;
        active = storeToUse.usedFilters[filter].includes(valueToCheck);
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
    }

    if (sortedValues.length > FILTERS_OPTIONS_LENGTH_LIMIT && !isToShowMore) {
      sortedValues.slice(0, FILTERS_OPTIONS_LENGTH_LIMIT).forEach(pushFilter);
    } else {
      sortedValues.forEach(pushFilter);
    }

    return filters;
  }

  const filtersToRender = renderFilters();

  if (isWithSearchField) {
    return (
      <div className="filters-search-field-wrap">
        <SearchField
          query={query}
          setQuery={setQuery}
          setFilteredValues={setFilteredValues}
          filter={filter}
          initialFilters={storeToUse.filters[filter]}
          ref={elemToFocusRef}
        />
        {filteredValues.length !== 0
          ? (
            <ul
              className="filters"
              data-testid={testId}
              ref={filterListRef}
            >
              {filtersToRender}
            </ul>
          )
          : (
            <p className="empty-filters-msg">
              We can't find such a filters
            </p>
          )
        }
        {filteredValues.length > FILTERS_OPTIONS_LENGTH_LIMIT &&
          <button
            className="filters-show-more-btn link-colors"
            onClick={showMoreFilters}
            ref={showMoreBtnRef}
          >
            <span>
              {isToShowMore ? "Collapse" : "Show all"}
            </span>
          </button>
        }
      </div >
    );
  }

  return (
    <div>
      {storeToUse.filters[filter].length !== 0
        ? (
          <ul
            className="filters"
            data-testid={testId}
            ref={filterListRef}
          >
            {filtersToRender}
          </ul>
        )
        : (
          <p className="empty-filters-msg">
            We can't find such a filters
          </p>
        )
      }
      {storeToUse.filters[filter].length > FILTERS_OPTIONS_LENGTH_LIMIT &&
        <button
          className="filters-show-more-btn link-colors"
          onClick={showMoreFilters}
          ref={showMoreBtnRef}
        >
          <span>
            {isToShowMore ? "Collapse" : "Show all"}
          </span>
        </button>
      }
    </div>
  )
});

export default CategoryFilterList;
