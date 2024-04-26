import StringActions from "../../../utils/StringActions";
import { SEARCH_CATALOG_ROUTE } from "../../../utils/consts";
import "./SearchResultItem.css";
import { Link } from "react-router-dom";

const SearchResultItem = ({ type, active = false, value, id, onFocus, inputValue, results, setResults, inputRef, isBackupValueOption = false }) => {
  let className = type !== "hint" ? `search-result-${type}` : "";
  className = active ? `${className} active` : className;
  const tabIndex = type === "hidden" ? "-1" : "0" ;

  function renderValue() {
    if (type === "hint" && inputValue) {
      const trimmedInputValue = StringActions.removeRedundantSpaces(inputValue); 
      
      const matchingSegment = value.slice(0, trimmedInputValue.length);
      const notMatchingSegment = value.slice(trimmedInputValue.length, value.length);

      return [
        <span key={`${type}-${value}-${trimmedInputValue}`} className="matching-search-result-segment">
          {matchingSegment}
        </span>,
        <span key={`${type}-${value}-${trimmedInputValue}-notMatching`}>{notMatchingSegment}</span>
      ];
    } else {
      return <span>{value.trimLeft()}</span>;
    }
  }

  function onClearSearch(e) {
    e.preventDefault();
    const newHistoryResults = results.history.filter((r, index) => index !== id)
    localStorage.setItem("historyResults", JSON.stringify(newHistoryResults));

    const nextResults = {
      ...results,
      history: newHistoryResults,
    };

    setResults(nextResults);
    inputRef.current.input.focus();
  }

  let to = "#";
  if (type === "hint" || type === "history") {
    to = SEARCH_CATALOG_ROUTE + `?page=1&pagesToFetch=1&text=${value}`;
  } 

  return (
    <li 
      className={`search-result ${className}`.trim()} 
      role="radio" 
      aria-checked={active} 
      aria-labelledby={value} 
      data-value={value}
      data-testid={`${isBackupValueOption ? "backup" : (id || null)}-searchResultHistory`}
    >
      <Link 
        // TODO: change the route to the catalog one with query params
        to={to}
        tabIndex={tabIndex}
        onFocus={onFocus}
      >
        {renderValue()}
        {type === "history" && <button className="clear-search-result" onClick={onClearSearch} />}
      </Link>
    </li>
  );
};

export default SearchResultItem;
