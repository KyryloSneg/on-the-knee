import DeviceComboActions from "../utils/DeviceComboActions";
import StringActions from "../utils/StringActions";
import { CATEGORY_CATALOG_ROUTE, DEVICE_ROUTE, SEARCH_CATALOG_ROUTE } from "../utils/consts";
import DeviceSearchResultItem from "./DeviceSearchResultItem";
import "./styles/SearchResultItem.css";
import { Link } from "react-router-dom";

const SearchResultItem = ({ 
  type, active = false, value, id, onFocus, inputValue, results, setResults, 
  inputRef, currentIndexAmongOtherResults, isBackupValueOption = false, stocks = null 
}) => {  
  let className = type !== "hint" ? `search-result-${type}` : "";
  className = active ? `${className} active` : className;
  const tabIndex = type === "hidden" ? "-1" : "0" ;

  function renderValue() {
    if (isBackupValueOption) {
      return <span className="color-black">{value.trim()}</span>;
    } else if (type === "hint" && inputValue) {
      const trimmedInputValue = StringActions.removeRedundantSpaces(inputValue); 
      
      const matchingSegment = value.slice(0, trimmedInputValue.length);
      const notMatchingSegment = value.slice(trimmedInputValue.length, value.length);

      return [
        <span key={`${type}-${value}-${trimmedInputValue}`} className="matching-search-result-segment">
          {matchingSegment}
        </span>,
        <span key={`${type}-${value}-${trimmedInputValue}-notMatching`}>{notMatchingSegment}</span>
      ];
    } else if (type === "device") {
      return <DeviceSearchResultItem 
                device={value} 
                defaultCombo={defaultComboInStock} 
              />;
    } else if (type === "category") {
      return (
        <span className="color-black">
          {StringActions.capitalize(value.name)}
        </span>
      )
    } else if (type === "category-search") {
      return (
        <span>
          <span className="color-black">{inputValue.trim()}</span> in category 
          <span className="bold"> {StringActions.capitalize(value.name)}</span>
        </span>
      );
    } else if (type === "history") {
      return <span>{value.trim()}</span>;
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

  let defaultComboInStock = null;
  let to = "#";

  if (type === "hint" || type === "history") {
    to = SEARCH_CATALOG_ROUTE + `?page=1&pagesToFetch=1&text=${value}`;
  } else if (type === "category") {
    to = CATEGORY_CATALOG_ROUTE + `${value.id}-${value.slug}`;
  } else if (type === "category-search") {
    to = SEARCH_CATALOG_ROUTE + `?categoryId=${value.id}&page=1&pagesToFetch=1&text=${inputValue}`;
  } else if (type === "device") {
    const { 
      defaultCombinationInStock: defaultCombo
    } = DeviceComboActions.findDefaultCombination(value, stocks); 

    const deviceRouteCombo = defaultCombo.combinationString || "default";
    to = DEVICE_ROUTE + `${value.id}--${deviceRouteCombo}`;

    // saving the combination to use it in the render function
    defaultComboInStock = defaultCombo;
  }

  const labelledBy = (type === "device" || type === "category" || type === "category-search")
    ? value.name
    : value;

  return (
    <li 
      className={`search-result ${className}`.trim()} 
      id={`search-result-${currentIndexAmongOtherResults}`}
      role="radio" 
      aria-checked={active} 
      aria-labelledby={labelledBy} 
      data-value={value}
      data-type={type}
      data-to={to}
      data-testid={`${isBackupValueOption ? "backup" : (id >= 0 ? id : null)}-searchResultHistory`}
    >
      <Link 
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
