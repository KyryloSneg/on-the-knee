import { useContext, useRef } from "react";
import useSearchResultControl from "../../../hooks/useSearchResultControls";
import useSelectedSearchValue from "../../../hooks/useSelectedSearchValue";
import SearchResultItem from "./SearchResultItem";
import "./SearchResults.css";
import useChangingMinMaxIds from "../../../hooks/useChangingMinMaxIds";
import { Context } from "../../../Context";

const SearchResults = ({ results, setResults, backupValue, setValue, minId, maxId, selectedId, setSelectedId, isInputFocused, inputRef }) => {
  const { app } = useContext(Context);

  const searchResultsRef = useRef(null);
  const amount = results.hint.length + results.device.length + results.category.length + results.history.length;

  useChangingMinMaxIds(minId, maxId, setSelectedId, results, backupValue);
  useSelectedSearchValue(selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef);
  useSearchResultControl(selectedId, setSelectedId, minId, maxId, backupValue, setValue, isInputFocused, app.isFocusedSearchForm, results);

  function onClearAllSearches() {
    localStorage.setItem("historyResults", JSON.stringify([]));
    const nextResults = {
      ...results,
      history: [],
    };

    setResults(nextResults);
    inputRef.current.input.focus();
  }

  // starting with 1 because we have one search result as minimum (if we have found any results)
  let currentResultId = 1;
  const isBackupValue = !!backupValue.trim().length;

  return (
    <ul className="search-product-results" role="radiogroup" ref={searchResultsRef}>
      {!amount
        ? <p className="no-search-results">We haven't found any results. Please clarify your request</p>
        : (
          <div>
            <SearchResultItem
              key={`${backupValue}-${minId.current}`}
              active={currentResultId === selectedId}
              value={backupValue}
              type={isBackupValue ? "default" : "hidden"}
              isBackupValueOption={true}
            />
            {!!results.hint.length &&
              <ul>
                {results.hint.map((result, index) => {
                  currentResultId += 1;
                  return (
                    <SearchResultItem
                      key={`${result.value}-${currentResultId}`}
                      active={currentResultId === selectedId}
                      value={result.value}
                      id={index}
                      inputValue={backupValue}
                    />
                  )
                })}
              </ul>
            }
            {!!results.device.length &&
              <ul>
                {results.device.map((result, index) => {
                  currentResultId += 1;
                  return (
                    <SearchResultItem
                      key={`${result.value}-${currentResultId}`}
                      active={currentResultId === selectedId}
                      value={result.value}
                      id={index}
                      inputValue={backupValue}
                    />
                  )
                })}
              </ul>
            }
            {!!results.category.length &&
              <li className="search-product-results-group">
                <p>Search by categories</p>
                <ul>
                  {results.category.map((result, index) => {
                    currentResultId += 1;
                    return (
                      <SearchResultItem
                        key={`category-${result.value}-${currentResultId}`}
                        type="category"
                        active={currentResultId === selectedId}
                        value={result.value}
                        id={index}
                      />
                    );
                  })}
                </ul>
              </li>
            }
            {(!!results.history.length && !isBackupValue) &&
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
                  {results.history.map((result, index) => {
                    currentResultId += 1;
                    return (
                      <SearchResultItem
                        key={`history-${result.value}-${currentResultId}`}
                        type="history"
                        active={currentResultId === selectedId}
                        value={result.value}
                        id={index}
                        results={results}
                        setResults={setResults}
                        inputRef={inputRef}
                      />
                    );
                  })}
                </ul>
              </li>
            }
          </div>
        )
      }
    </ul>
  );
}

export default SearchResults;
