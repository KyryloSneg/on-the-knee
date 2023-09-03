import { useRef } from "react";
import useSearchResultControl from "../../../hooks/useSearchResultControls";
import useSelectedSearchValue from "../../../hooks/useSelectedSearchValue";
import useSetSelectingSearchId from "../../../hooks/useSetSelectingSearchId";
import SearchResultItem from "./SearchResultItem";
import "./SearchResults.css";

const SearchResults = ({ results, setResults, backupValue, setValue, minId, maxId, selectedId, setSelectedId, isInputFocused, isFocused, inputRef }) => {
  const searchResultsRef = useRef(null);
  const amount = results.default.length + results.categories.length + results.history.length;

  useSetSelectingSearchId(minId, setSelectedId, backupValue);
  useSelectedSearchValue(selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef);
  useSearchResultControl(selectedId, setSelectedId, minId, maxId, backupValue, setValue, isInputFocused, isFocused, results);

  function onClearAllSearches() {
    // TODO: deleting search history from localstorage / DB
    // (if the last one we should use try...catch)
    const nextResults = {
      ...results,
      history: [],
    };

    setResults(nextResults);
    inputRef.current.input.focus();
  }

  const isBackupValue = !!backupValue.trim().length;
  // using "!!" operators because it doesn't work without it somehow
  if (!isBackupValue && !!results.history.length) {
    return (
      <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
        <SearchResultItem
          key={`${backupValue}-${minId}`}
          value={backupValue}
          amount={amount}
          active={selectedId === minId}
          type="hidden"
          isBackupValueOption={true}
        />
        <li className="search-product-results-group">
          <div className="search-history-div">
            <p>Search history</p>
            <button
              className="clear-search-results-history link-colors"
              onClick={onClearAllSearches}
              data-testid="clear-search-results-history"
            >
              Clear history
            </button>
          </div>
          <ul>
            {results.history.map(result => {
              const isSelected = result.id === selectedId;
              return (
                <SearchResultItem
                  key={`history-${result.value}-${result.id}`}
                  type="history"
                  value={result.value}
                  id={result.id}
                  amount={amount}
                  active={isSelected}
                  results={results}
                  setResults={setResults}
                  inputRef={inputRef}
                />
              );
            })}
          </ul>
        </li>
      </ul>
    );
  }

  if (isBackupValue && !amount) {
    return (
      <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
        {backupValue &&
          <SearchResultItem
            key={`${backupValue}-${minId}`}
            value={backupValue}
            amount={amount}
            active={selectedId === minId}
            isBackupValueOption={true}
          />
        }
        <p className="no-search-results">We haven't found any results. Please clarify your request</p>
      </ul>
    );
  }

  if (isBackupValue) {
    return (
      <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
        <SearchResultItem
          key={`${backupValue}-${minId}`}
          value={backupValue}
          amount={amount}
          active={selectedId === minId}
          isBackupValueOption={true}
        />
        {results.default.map(result => {
          const isSelected = result.id === selectedId;
          return (
            <SearchResultItem
              key={`${result.value}-${result.id}`}
              value={result.value}
              id={result.id}
              amount={amount}
              active={isSelected}
              inputValue={backupValue}
            />
          )
        })}
        {!!results.history.length &&
          <li className="search-product-results-group">
            <div className="search-history-div">
              <p>Search history</p>
              <button
                className="clear-search-results-history link-colors"
                onClick={onClearAllSearches}
              >
                Clear history
              </button>
            </div>
            <ul>
              {results.history.map(result => {
                const isSelected = result.id === selectedId;
                return (
                  <SearchResultItem
                    key={`history-${result.value}-${result.id}`}
                    type="history"
                    value={result.value}
                    id={result.id}
                    amount={amount}
                    active={isSelected}
                    results={results}
                    setResults={setResults}
                    inputRef={inputRef}
                  />
                );
              })}
            </ul>
          </li>
        }
        {!!results.categories.length &&
          <li className="search-product-results-group">
            <p>Search by categories</p>
            <ul>
              {results.categories.map(result => {
                const isSelected = result.id === selectedId;
                return (
                  <SearchResultItem
                    key={`category-${result.value}-${result.id}`}
                    type="category"
                    value={result.value}
                    id={result.id}
                    amount={amount}
                    active={isSelected}
                  />
                );
              })}
            </ul>
          </li>
        }
      </ul>
    );
  }

  if (!results.history.length) {
    return (
      <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
        <SearchResultItem
          key={`${backupValue}-${minId}`}
          value={backupValue}
          amount={amount}
          active={selectedId === minId}
          isBackupValueOption={true}
        />
      </ul>
    );
  }

  return (
    <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
      <SearchResultItem
        key={`${backupValue}-${minId}`}
        value={backupValue}
        amount={amount}
        active={selectedId === minId}
        type="hidden"
        isBackupValueOption={true}
      />
      <li className="search-product-results-group">
        <div className="search-history-div">
          <p>Search history</p>
          <button
            className="clear-search-results-history link-colors"
            onClick={onClearAllSearches}
          >
            Clear history
          </button>
        </div>
        <ul>
          {results.history.map(result => {
            const isSelected = result.id === selectedId;
            return (
              <SearchResultItem
                key={`history-${result.value}-${result.id}`}
                type="history"
                value={result.value}
                id={result.id}
                amount={amount}
                active={isSelected}
                results={results}
                setResults={setResults}
                inputRef={inputRef}
              />
            );
          })}
        </ul>
      </li>
    </ul>
  );
}

export default SearchResults;
