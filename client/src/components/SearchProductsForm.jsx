import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./styles/SearchProductsForm.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import SearchProductLine from "./SearchProductLine";
import SearchResults from "./SearchResults";
import useFnOnSomeValue from "../hooks/useFnOnSomeValue";
import { DEVICE_ROUTE, HISTORY_SEARCH_RESULTS_MAX_AMOUNT, mockSearchResults } from "../utils/consts";
import useDeleteValueOnEsc from "../hooks/useDeleteValueOnEsc";
import StringActions from "../utils/StringActions";
import setSearchFormVisibility from "../utils/setSearchFormVisibility";
import useSearchResultsFetching from "../hooks/useSearchResultsFetching";
import { addHintSearchResult } from "../http/HintSearchResultsAPI";
import getDevicesBySearchQuery from "../utils/getDevicesBySearchQuery";
import useGettingDeviceRelatedData from "../hooks/useGettingDeviceRelatedData";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import DeviceComboActions from "../utils/DeviceComboActions";
import getPreparedForMockServerStr from "../utils/getPreparedForMockServerStr";
import LocalStorageActions from "../utils/LocalStorageActions";
import { useLocation } from "react-router-dom";

const SearchProductsForm = observer(({ navbarRef }) => {
  const { app, isTest, isEmptySearchResults } = useContext(Context);
  const navigate = useNavigateToEncodedURL();
  const location = useLocation();

  const [stocks, setStocks] = useState([]);
  const [value, setValue] = useState(""); // the value that will be submitted to the form
  // the value that user can return to (it renders as the first search option if the input value isn't empty)
  const [backupValue, setBackupValue] = useState("");
  let initialResValue = {
    hint: [],
    device: [],
    category: [],
    history: LocalStorageActions.getItem("historyResults") || []
  };

  if (!isEmptySearchResults && isTest) {
    initialResValue = mockSearchResults;
  }

  const [results, setResults] = useState(initialResValue);

  // empty search history test
  // const [results, setResults] = useState({...mockSearchResults, history: []});

  const [selectedId, setSelectedId] = useState(null);

  const minId = useRef(null);
  const maxId = useRef(null);

  const formRef = useRef(null);
  const searchBtnRef = useRef(null);
  const inputRef = useRef(null);

  // the "real" input focus
  const [isInputFocused, setIsInputFocused] = useState(false);
  useEffect(() => {
    // if user left the component, reset selectedId to prevent bugs 
    if (!app.isFocusedSearchForm) setSelectedId(null);
  }, [app.isFocusedSearchForm]);

  // using the useCallback hook below to use the function in the useEffect hook without any linter warnings

  // focusing input (making it wider, showing the dark bg)
  const focusInput = useCallback(() => {
    setSearchFormVisibility(true, app);
  }, [app]);

  // vice versa
  const blurInput = useCallback(() => {
    setSearchFormVisibility(false, app);
    // eslint-disable-next-line
  }, [app]);

  const amount = results.hint.length + results.device.length + results.category.length + results.history.length;
  const isResultsOrValue = amount || value;

  const onEmptyResultsOrValue = useCallback(() => {
    app.setIsFocusedSearchForm(false);
    blurInput();
  }, [app, blurInput]);

  useFnOnSomeValue(value, focusInput, null);
  useFnOnSomeValue(isResultsOrValue, null, onEmptyResultsOrValue);

  useDeleteValueOnEsc(setValue, setBackupValue, app.isFocusedSearchForm);

  function onInputFocus() {
    setIsInputFocused(true);
    if (app.isFocusedSearchForm || value === "") return;
    focusInput();
  }

  function onFormBlur(e) {
    const focusedElem = e.relatedTarget;

    if (!focusedElem) return;
    if (formRef.current.contains(focusedElem)) return;

    blurInput();

    const nextBackupValue = StringActions.removeRedundantSpaces(value);
    setBackupValue(nextBackupValue);
  }

  function onSubmitBtnBlur(e) {
    // if the input isn't focused we do nothing, else we check other conditions and if everything is ok we focus the button
    // (it's not the best solution i guess but i've haven't found out what i can do else here)
    if (!app.isFocusedSearchForm) return;

    const focusedElem = e.relatedTarget;
    if (formRef.current.contains(focusedElem)) return;

    searchBtnRef.current.focus();
  }

  function onInputBlur(e) {
    setIsInputFocused(false);
    if (!app.isFocusedSearchForm) return;

    const focusedElem = e.relatedTarget;
    if (formRef.current.contains(focusedElem)) return;
    if (!navbarRef.current.contains(focusedElem)) return;

    inputRef.current.input.focus();
  }

  function deleteInputContent() {
    setValue("");
    setBackupValue("");

    inputRef.current.input.focus();
    setIsInputFocused(true);
  }

  function onBackBtnClick() {
    // using this condition to prevent input unfocusing on pressing enter key
    // (idk how it happens)
    if (document.activeElement !== inputRef.current.backBtn) return;

    app.setIsFocusedSearchForm(false);
    blurInput();
    inputRef.current.input.focus();
  }

  function onChange(e) {
    if (selectedId !== minId.current) {
      setSelectedId(minId.current);
    }

    // for test purpose
    // const mockResults = {...mockSearchResults, history: []};

    const nextBackupValue = StringActions.removeRedundantSpaces(e.target.value);
    if (!results.history.length && !nextBackupValue) {
      blurInput();
    }

    setValue(e.target.value);
    setBackupValue(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!!value.trim().length || selectedId !== minId.current) {
      try {
        function updateHistoryResults(newHistoryResultValue) {
          // we can't store array in localStorage, so we save it as string and getting with JSON.parse(...) method
          let storageHistoryResults = LocalStorageActions.getItem("historyResults") || [];
          let newHistoryResult = { value: newHistoryResultValue };
  
          let newHistoryResults = [...storageHistoryResults];
          const isAlreadyExists = !!storageHistoryResults.find(result => result.value === newHistoryResult.value);
  
          if (isAlreadyExists) {
            // move the already existing result to the end of the array
            newHistoryResults = newHistoryResults.filter(result => result.value !== newHistoryResult.value);
            newHistoryResults.push(newHistoryResult);
          } else {
            if (storageHistoryResults.length >= HISTORY_SEARCH_RESULTS_MAX_AMOUNT) {
              newHistoryResults = [...storageHistoryResults, newHistoryResult];
              newHistoryResults = newHistoryResults.slice(1);
            } else {
              newHistoryResults = [...storageHistoryResults, newHistoryResult];
            }
          }
  
          localStorage.setItem("historyResults", JSON.stringify(newHistoryResults));
        }

        if (selectedId !== minId.current) {
          const selectedSearchResult = document.getElementById(`search-result-${selectedId}`);

          if (selectedSearchResult) {
            if (
              selectedSearchResult.dataset.type === "hint" 
              || selectedSearchResult.dataset.type === "history"
            ) {
              updateHistoryResults(selectedSearchResult.dataset.value.trim());
            }

            navigate(selectedSearchResult.dataset.to, { 
              replace: selectedSearchResult.dataset.to === location.pathname + location.search 
            });
          }
        } else {
          updateHistoryResults(value.trim());

          // add hint search result only if the result links to not empty catalog page
          const preparedValue = getPreparedForMockServerStr(backupValue);
          const fetchStringQueryParams = `name_like=${encodeURIComponent(preparedValue.trim().toLowerCase())}`.replaceAll(`"`, "");
          const { devices: devicesBySearchQuery } = await getDevicesBySearchQuery(fetchStringQueryParams);
  
          if (devicesBySearchQuery.length === 1) {
            // navigating directly to device page
            const {
              defaultCombinationInStock: defaultCombo
            } = DeviceComboActions.findDefaultCombination(devicesBySearchQuery[0], stocks);
  
            const deviceRouteCombo = defaultCombo.combinationString || "default";
            const to = DEVICE_ROUTE + `${devicesBySearchQuery[0].id}--${deviceRouteCombo}`;
  
            navigate(to, { replace: to === location.pathname + location.search });
          } else {
            addHintSearchResult({ value: value.trim().toLowerCase() })
  
            const hrefValue = value.trim().replaceAll("&", "%2526");
            const href = `/search/?text=${hrefValue}&page=1&pagesToFetch=1`;
  
            navigate(href, { replace: href === location.pathname + location.search });
          }
        }

      } catch (error) {
        console.log(error.message)
      } finally {
        setBackupValue(value);
        setIsInputFocused(false);
        blurInput();
        inputRef.current.input.blur();
      }
    }
  }

  useSearchResultsFetching(setResults, backupValue);
  useGettingDeviceRelatedData(null, null, setStocks, results);
  
  return (
    <form className="search-product-form" role="search" onSubmit={onSubmit} onBlur={onFormBlur} ref={formRef}>
      <div className="search-product-with-results">
        <SearchProductLine
          value={value}
          onChange={onChange}
          deleteInputContent={deleteInputContent}
          backToNavbar={onBackBtnClick}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
          ref={inputRef}
          hintSearchResults={app.hintSearchResults}
        />
        {app.isFocusedSearchForm &&
          <SearchResults
            results={results}
            setResults={setResults}
            backupValue={backupValue}
            setValue={setValue}
            minId={minId}
            maxId={maxId}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isInputFocused={isInputFocused}
            inputRef={inputRef}
            stocks={stocks}
          />
        }
      </div>
      <button type="submit" onBlur={onSubmitBtnBlur} ref={searchBtnRef} data-testid="search-product-submit-btn">
        Search
      </button>
    </form>
  );
});

export default SearchProductsForm;
