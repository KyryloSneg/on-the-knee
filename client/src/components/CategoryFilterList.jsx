import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import CategoryFilter from "./CategoryFilter";
import "./styles/CategoryFilterList.css";
import { observer } from "mobx-react-lite";
import SearchField from "./UI/searchField/SearchField";
import ArrayActions from "../utils/ArrayActions";
import { FILTERS_OPTIONS_LENGTH_LIMIT } from "../utils/consts";
import getAllFocusableElements from "../utils/getAllFocusableElements";
import useWindowInvisibleFocus from "../hooks/useWindowInvisibleFocus";

const CategoryFilterList = observer(({ filter, variant, elemToFocusRef = null }) => {
  const { deviceStore } = useContext(Context);
  const isWithSearchField = variant === "withSearchField";

  const invisibleFocusElem = useRef(null);
  const filterListRef = useRef(null);
  const showMoreBtnRef = useRef(null);

  const [isToShowMore, setIsToShowMore] = useState(false);
  const [query, setQuery] = useState("");

  const [filteredValues, setFilteredValues] = useState(deviceStore.filters[filter]);
  let testId = `CategoryFilterList: ${filter.toLowerCase()}`;

  function showMoreFilters() {
    setIsToShowMore(!isToShowMore);
  }

  useEffect(() => {
    if (document.activeElement === showMoreBtnRef.current && document.activeElement !== null) {
      const filtersElems = getAllFocusableElements(filterListRef.current);

      if (isToShowMore) {
        console.log("yippee");
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
    }


    if (sortedValues.length >= FILTERS_OPTIONS_LENGTH_LIMIT && !isToShowMore) {
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
          initialFilters={deviceStore.filters[filter]}
          ref={elemToFocusRef}
        />
        <ul 
          className="filters use-preety-scrollbar" 
          data-testid={testId} 
          ref={filterListRef}
        >
          {filteredValues.length !== 0
            ? (
              filtersToRender
            )
            : (
              <p className="empty-filters-msg">
                We can't find such a filters
              </p>
            )
          }
        </ul>
        {filtersToRender.length >= FILTERS_OPTIONS_LENGTH_LIMIT &&
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
      <ul
        className="filters use-preety-scrollbar"
        data-testid={testId}
        key="filters-list"
        ref={filterListRef}
      >
        {filteredValues.length !== 0
          ? (
            filtersToRender
          )
          : (
            <p className="empty-filters-msg">
              We can't find such a filters
            </p>
          )
        }
      </ul>,
      {filtersToRender.length >= FILTERS_OPTIONS_LENGTH_LIMIT &&
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
