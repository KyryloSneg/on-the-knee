import { forwardRef } from "react";
import useDebounce from "../../../hooks/useDebounce";
import "./SearchField.css";
import DeleteInputContent from "../deleteInputContent/DeleteInputContent";

const SearchField = forwardRef(({ query, setQuery, setFilteredValues, filter, initialFilters }, ref) => {
  function filterValues(query) {
    const nextFilteredValues = initialFilters.filter(info => {
      if (query === "") return true;
      return info.value.trim().toLowerCase().includes(query.trim().toLowerCase());
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
          <DeleteInputContent onClick={onClick} />
        )}
      </div>
    </div>
  );
});

export default SearchField;
