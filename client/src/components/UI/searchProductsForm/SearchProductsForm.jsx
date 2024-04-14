import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./SearchProductsForm.css";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import SearchProductLine from "./SearchProductLine";
import SearchResults from "./SearchResults";
import useFnOnSomeValue from "../../../hooks/useFnOnSomeValue";
import { mockSearchResults } from "../../../utils/consts";
import useDeleteValueOnEsc from "../../../hooks/useDeleteValueOnEsc";
import filterSearchResultFn from "../../../utils/filterSearchResultFn";
import StringActions from "../../../utils/StringActions";
import setSearchFormVisibility from "../../../utils/setSearchFormVisibility";

const SearchProductsForm = observer(({ navbarRef }) => {
  const { app, isTest, isEmptySearchResults } = useContext(Context);
  const [value, setValue] = useState(""); // the value that will be submitted to the form
  // the value that user can return to (it renders as the first search option if the input value isn't empty)
  const [backupValue, setBackupValue] = useState("");
  // TODO: change mock value to the real one
  let initialResValue = { default: [], categories: [], history: [] };
  if (!isEmptySearchResults) {
    initialResValue = isTest ? mockSearchResults : mockSearchResults;
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

  useEffect(() => {
    if (app.headerRef) {
      if (app.isFocusedSearchForm) {
        app.headerRef.current.classList.add("closer-than-darkbg");
      } else {
        app.headerRef.current.classList.remove("closer-than-darkbg");
      }
    }
  }, [app.isFocusedSearchForm, app]);

  // using the useCallback hook below to use the function in the useEffect hook without any linter warnings
  
  // focusing input (making it wider, showing the dark bg)
  const focusInput = useCallback(() => {
    setSearchFormVisibility(true, app);
  }, [app, app.navBtnGroupRef]);

  // vice versa
  const blurInput = useCallback(() => {
    setSearchFormVisibility(false, app);

    // by adding this we make sure that on returning to the form user will get correct results immediately
    // (maybe i would need to delete it when I'll implement almost real version of filtering results)
    const mockResults = mockSearchResults;
    filterResults(value, mockResults);
    // eslint-disable-next-line
  }, [app, app.navBtnGroupRef]);

  const amount = results.default.length + results.history.length + results.categories.length;
  const isResultsOrValue = amount || value;

  const onEmptyResultsOrValue = useCallback(() => {
    app.setIsFocusedSearchForm(false);
    blurInput();
  }, [app, blurInput]);

  useFnOnSomeValue(value, focusInput, null);
  useFnOnSomeValue(isResultsOrValue, null, onEmptyResultsOrValue);

  useDeleteValueOnEsc(setValue, setBackupValue, app.isFocusedSearchForm);

  function filterResults(nextBackupValue, mockResults) {

    let nextResults = { default: [], categories: [], history: [] };
    if (!isEmptySearchResults) {
      // if our value is empty and our history search results aren't empty we show a couple of them
      if (!nextBackupValue.length && mockResults.history.length) {
        nextResults = {
          default: [],
          history: mockResults.history.slice(0, 6),
          categories: [],
        }
      } else {
        nextResults = {
          default: mockResults.default.filter(d => filterSearchResultFn(d.value, nextBackupValue)),
          history: mockResults.history.slice(0, 6),
          categories: mockResults.categories.filter(c => filterSearchResultFn(c.value, nextBackupValue, false)),
        }
      }
    }

    setResults(nextResults);

  }

  // useEffect(() => {
  //   if (!app.isFocusedSearchForm && (value.length || backupValue.length)) filterResults(value, mockResults);
  // }, [app.isFocusedSearchForm]);

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
    // for test purpose
    // const mockResults = {...mockSearchResults, history: []};

    // TODO: change mock results below to the real ones
    const mockResults = mockSearchResults;
    
    setBackupValue(nextBackupValue);
    filterResults(nextBackupValue, mockResults);
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

    // instead of mockResults we must use real data later on
    const mockResults = mockSearchResults;
    const nextBackupValue = StringActions.removeRedundantSpaces(e.target.value);

    if (!mockResults.history.length && !nextBackupValue) {
      blurInput();
    }

    filterResults(nextBackupValue, mockResults);

    setValue(e.target.value);
    setBackupValue(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!!value.trim().length) {
      try {
        // TODO: searching products
      } catch (error) {
        // TODO: error handling
      } finally {
        setBackupValue(value);
        setIsInputFocused(false);
        blurInput();
        inputRef.current.input.blur();
      }
    }
  }

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
