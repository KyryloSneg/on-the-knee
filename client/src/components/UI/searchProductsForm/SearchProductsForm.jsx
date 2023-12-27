import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./SearchProductsForm.css";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import SearchProductLine from "./SearchProductLine";
import SearchResults from "./SearchResults";
import useFnOnSomeValue from "../../../hooks/useFnOnSomeValue";
import useClickOnTheDarkBg from "../../../hooks/useClickOnTheDarkBg";
import { mockSearchResults } from "../../../utils/consts";
import useDeleteValueOnEsc from "../../../hooks/useDeleteValueOnEsc";
import useMinMaxIds from "../../../hooks/useMinMaxIds";
import filterSearchResultFn from "../../../utils/filterSearchResultFn";
import StringActions from "../../../utils/StringActions";

const SearchProductsForm = observer(({ btnGroupRef, navbarRef }) => {
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
  const [minId, maxId] = useMinMaxIds(results, setSelectedId);

  const formRef = useRef(null);
  const searchBtnRef = useRef(null);
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  // the "real" input focus
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (app.headerRef) {
      if (isFocused) {
        app.headerRef.current.className = "closer-than-darkbg";
      } else {
        app.headerRef.current.className = "";
      }
    }
  }, [isFocused, app]);

  // using the useCallback hook below to use the function in the useEffect hook without any linter warnings
  
  // focusing input (making it wider, showing the dark bg)
  const focusInput = useCallback(() => {
    btnGroupRef.current.classList.add("focusedSearch");
    app.setDarkBgVisible(true);
    setIsFocused(true);
  }, [app, btnGroupRef]);

  // vice versa
  const blurInput = useCallback(() => {
    app.setDarkBgVisible(false);
    btnGroupRef.current.classList.remove("focusedSearch");
    setIsFocused(false);
  }, [app, btnGroupRef]);

  const amount = results.default.length + results.history.length + results.categories.length;
  const isResultsAndValue = amount || value;
  const onEmptyResultsAndValue = useCallback(() => {
    setIsFocused(false);
    blurInput();
  }, [setIsFocused, blurInput]);

  useFnOnSomeValue(value, focusInput, null);
  useFnOnSomeValue(isResultsAndValue, null, onEmptyResultsAndValue);

  const onClickOnTheDarkBg = isFocused ? blurInput : null;
  useClickOnTheDarkBg(onClickOnTheDarkBg, app.darkBgVisible);
  useDeleteValueOnEsc(setValue, setBackupValue, isFocused);

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
          history: mockResults.history.filter(h => filterSearchResultFn(h.value, nextBackupValue, false)),
          categories: mockResults.categories.filter(c => filterSearchResultFn(c.value, nextBackupValue, false)),
        }
      }
    }

    setResults(nextResults);

  }

  function onInputFocus() {
    setIsInputFocused(true);
    if (isFocused || value === "") return;
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
    // (it's not the best solution i guess but i've havent found out what i can do else here)
    if (!isFocused) return;

    const focusedElem = e.relatedTarget;
    if (formRef.current.contains(focusedElem)) return;

    searchBtnRef.current.focus();
  }

  function onInputBlur(e) {
    setIsInputFocused(false);
    if (!isFocused) return;

    const focusedElem = e.relatedTarget;
    if (formRef.current.contains(focusedElem)) return;
    if (!navbarRef.current.contains(focusedElem)) return;
    
    inputRef.current.input.focus();
  }

  function deleteInputContent() {
    setValue("");
    setBackupValue("");
    inputRef.current.input.focus();
  }

  function onBackBtnClick() {
    setIsFocused(false);
    blurInput();
    inputRef.current.input.focus();
  }

  function onChange(e) {
    if (selectedId !== minId) {
      setSelectedId(minId);
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
    try {
      // TODO: searching products
    } catch (error) {
      // TODO: error handling
    } finally {
      setBackupValue(value);

      inputRef.current.input.blur();
      setIsInputFocused(false);
      setIsFocused(false);
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
        {isFocused &&
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
            isFocused={isFocused}
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
