import "./styles/SearchResults.css";
import { useContext, useRef } from "react";
import useSearchResultControl from "../hooks/useSearchResultControls";
import useSelectedSearchValue from "../hooks/useSelectedSearchValue";
import SearchResultItem from "./SearchResultItem";
import useChangingMinMaxIds from "../hooks/useChangingMinMaxIds";
import { Context } from "../Context";

const SearchResults = ({ 
  results, setResults, backupValue, setValue,
  minId, maxId, selectedId, setSelectedId, 
  isInputFocused, inputRef, stocks
}) => {
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

  let currentResultId = minId.current;
  const isBackupValue = !!backupValue.trim().length;

  return (
    <div className="search-product-results" role="radiogroup" ref={searchResultsRef}>
      {!amount
        ? <p className="no-search-results">We haven't found any results. Please clarify your request</p>
        : (
          <div>
            <SearchResultItem
              key={`${backupValue}-${minId.current}`}
              active={currentResultId === selectedId}
              value={backupValue}
              type={isBackupValue ? "hint" : "hidden"}
              currentIndexAmongOtherResults={currentResultId}
              isBackupValueOption={true}
            />
            {!!results.hint.length &&
              <ul>
                {results.hint.map((result, index) => {
                  currentResultId += 1;
                  return (
                    <SearchResultItem
                      type="hint"
                      key={`${result.value}-${currentResultId}`}
                      active={currentResultId === selectedId}
                      value={result.value}
                      id={index}
                      inputValue={backupValue}
                      currentIndexAmongOtherResults={currentResultId}
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
                      key={`${result.id}-${currentResultId}`}
                      type="device"
                      active={currentResultId === selectedId}
                      value={result}
                      id={index}
                      inputValue={backupValue}
                      currentIndexAmongOtherResults={currentResultId}
                      stocks={stocks}
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
                        key={`category-${result.id}-${currentResultId}`}
                        type="category"
                        active={currentResultId === selectedId}
                        value={result}
                        inputValue={backupValue}
                        id={index}
                        currentIndexAmongOtherResults={currentResultId}
                      />
                    );
                  })}
                </ul>
              </li>
            }
            {/* search in category (category catalog page + ?text="our query"): */}
            {!!results.category.length &&
              <li className="search-product-results-group">
                <p>Search in categories</p>
                <ul>
                  {results.category.map((result, index) => {
                    currentResultId += 1;
                    return (
                      <SearchResultItem
                        key={`categorySearch-${result.id}-${currentResultId}`}
                        type="category-search"
                        active={currentResultId === selectedId}
                        value={result}
                        inputValue={backupValue}
                        id={index}
                        currentIndexAmongOtherResults={currentResultId}
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
                        currentIndexAmongOtherResults={currentResultId}
                      />
                    );
                  })}
                </ul>
              </li>
            }
          </div>
        )
      }
    </div>
  );
}

export default SearchResults;
