import { forwardRef, useImperativeHandle, useRef } from "react";
import "./SearchProductLine.css"

const SearchProductLine = forwardRef(({ value, onChange, deleteInputContent, backToNavbar, onInputFocus, onInputBlur }, ref) => {
  const searchLineRef = useRef(null);
  const backBtnRef = useRef(null);
  const inputRef = useRef(null);

  // handling multiple refs
  useImperativeHandle(ref, () => {
    return {
      get searchLine() {
        return searchLineRef.current;
      },

      get backBtn() {
        return backBtnRef.current;
      },

      get input() {
        return inputRef.current;
      }
    };
  })

  return (
    <div className="search-product-line-wrap" ref={searchLineRef}>
      <button 
        className="input-back-btn" 
        onBlur={onInputBlur} 
        onClick={backToNavbar} 
        ref={backBtnRef} 
        data-testid="search-product-back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
          <path d="M360-216 96-480l264-264 51 51-177 177h630v72H234l177 177-51 51Z" />
        </svg>
      </button>
      <input
        type="search"
        name="search-product-line"
        placeholder="Search"
        className="search-product-line"
        aria-label="Search product"
        autoComplete="off"
        value={value}
        onChange={onChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={inputRef}
        data-testid="search-product-line"
      />
      <button
        type="button"
        className="delete-input-content-btn active"
        aria-label="Delete input content"
        onClick={deleteInputContent}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path
            d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
        </svg>
      </button>
    </div>
  );
});

export default SearchProductLine;
