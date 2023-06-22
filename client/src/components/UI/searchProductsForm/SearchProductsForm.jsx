import { useState } from "react";
import "./SearchProductsForm.css";

const SearchProductsForm = () => {
  const [value, setValue] = useState("");

  function onChange(e) {
    setValue(e.target.value);
  }

  function onClick() {
    setValue("");
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      // TODO: searching products
    } catch(error) {
      // TODO: error handling
    } finally {
      setValue("");
    }
  }

  return (
    <form className="search-product-form" onSubmit={onSubmit}>
      <div className="search-product-line-wrap">
        <input 
          type="search" 
          name="search-product-line"
          placeholder="Search" 
          className="search-product-line"
          aria-label="Search product" 
          autoComplete="off" 
          value={value}
          onChange={onChange}  
        />
        <button 
          type="button" 
          className="delete-input-content-btn active" 
          aria-label="Delete input content"
          onClick={onClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
            <path
              d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
          </svg>
        </button>
      </div>
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchProductsForm;
