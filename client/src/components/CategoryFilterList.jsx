import { forwardRef, useContext, useState } from "react";
import { Context } from "../Context";
import CategoryFilter from "./CategoryFilter";
import "./styles/CategoryFilterList.css";
import { observer } from "mobx-react-lite";
import { onKeyDown } from "../utils/dropdownOptionsControl";
import SearchField from "./UI/searchField/SearchField";

const CategoryFilterList = observer(forwardRef(({ filter, optionRefs, filterCategoryBlockId, className, variant, elemToFocusRef = null }, ref) => {
  const isWithSearchField = variant === "withSearchField";
  const { deviceStore } =  useContext(Context);
  const [query, setQuery] = useState("");
  const [filteredValues, setFilteredValues] = useState(deviceStore.filters[filter]);

  return (
    <ul className={className} ref={ref} data-testid={`CategoryFilterList: ${filterCategoryBlockId}`}>
      {isWithSearchField && (
        <SearchField 
          query={query} 
          setQuery={setQuery}
          ref={elemToFocusRef}
          setFilteredValues={setFilteredValues}
          filter={filter}
          filterCategoryBlockId={filterCategoryBlockId}
        />
      )}
      {filteredValues.length !== 0
        ? (
          filteredValues.map(value => {
            let active;
            
            if (deviceStore.usedFilters[filter]) {
              active = deviceStore.usedFilters[filter].includes(value);
            }

            if (optionRefs.current.length !== filteredValues.length) {
              optionRefs.current = [];
            }
            
            const id = filteredValues.indexOf(value);
    
            return (
              <li key={`${filter}: ${value}`}>
                <CategoryFilter
                  filter={filter}
                  value={value}
                  active={active}
                  onKeyDown={e => onKeyDown(e, id, filteredValues, optionRefs)}
                  ref={ref => {
                    if (!ref || optionRefs.current.includes(ref)) return;
                    optionRefs.current.push(ref);
                  }}
                  testId={`${filter}: ${value}`}
                />
              </li>
            );
          })
        )
        : <p className="empty-filters-msg">
            We can't find such a filters
          </p>
      }
    </ul>
  );
}));

export default CategoryFilterList;
