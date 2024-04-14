import StringActions from "../../../utils/StringActions";
import "./SearchResultItem.css";
import { Link } from "react-router-dom";

const SearchResultItem = ({ type = "default", active = false, value, id, onFocus, inputValue, results, setResults, inputRef, isBackupValueOption = false }) => {
  let className = type !== "default" ? `search-result-${type}` : "";
  className = active ? `${className} active` : className;
  const tabIndex = type === "hidden" ? "-1" : "0" ;

  function renderValue() {
    if (type === "default" && inputValue) {
      const trimmedInputValue = StringActions.removeRedundantSpaces(inputValue); 
      const notMatchingSegment = value.slice(trimmedInputValue.length);

      return [
        <span key={`${type}-${value}-${trimmedInputValue}`} className="matching-search-result-segment">
          {trimmedInputValue}
        </span>,
        <span key={`${type}-${value}-${trimmedInputValue}-notMatching`}>{notMatchingSegment}</span>
      ];
    } else {
      return <span>{value.trimLeft()}</span>;
    }
  }

  function onClearSearch(e) {
    e.preventDefault();
    const nextResults = {
      ...results,
      history: results.history.filter(r => r.id !== id),
    };

    setResults(nextResults);
    inputRef.current.input.focus();
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
        to={"/catalog/some_route"}
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
