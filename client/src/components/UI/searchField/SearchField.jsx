import { forwardRef } from "react";
import useDebounce from "../../../hooks/useDebounce";
import "./SearchField.css";

const SearchField = forwardRef(({ query, setQuery, setFilteredValues, filter, initialFilters }, ref) => {
  function filterValues(query) {
    const nextFilteredValues = initialFilters.filter(value => {
      if (query === "") return true;
      return value.trim().toLowerCase().includes(query.trim().toLowerCase());
    });

    setFilteredValues(nextFilteredValues);
  }

  const debouncedFilterValues = useDebounce(query => filterValues(query), 200);

  function onChange(e) {
    const nextQuery = e.target.value;
    setQuery(nextQuery);

    debouncedFilterValues(nextQuery);
  }

  function onClick() {
    setQuery("");
    setFilteredValues(initialFilters);
  }

  function onKeyDown(e) {
    if (e.code === "Escape") {
      setQuery("");
      setFilteredValues(initialFilters);
    }
  }

  return (
    <div className="search-field-wrap-wrapper">
      <div className="search-field-wrap">
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search..."
          aria-label="Search filters"
          autoComplete="off"
          className="search-line"
          onKeyDown={onKeyDown}
          ref={ref}
          data-testid={`search-field-input: ${filter}`}
        />
        {query && (
          <button
            type="button"
            className="delete-input-content-btn active"
            aria-label="Delete input content"
            onClick={onClick}
            data-testid={`delete-input-content-btn: ${filter}`}
          >
            {/* writing svg into the component to style it easily */}
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
              <path
                d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default SearchField;
