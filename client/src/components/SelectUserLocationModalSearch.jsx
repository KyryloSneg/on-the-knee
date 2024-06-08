import { useRef } from "react";
import DeleteInputContent from "./UI/deleteInputContent/DeleteInputContent";
import "./styles/SelectUserLocationModalSearch.css"

const SelectUserLocationModalSearch = ({ query, setQuery }) => {
  const inputRef = useRef(null);

  function onChange(e) {
    setQuery(e.target.value);
  }

  function onClick() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="select-user-location-modal-search-wrap">
      <div className="select-user-location-modal-search">
        <input
          type="search"
          placeholder="Search"
          aria-label="Search your location"
          autoComplete="off"
          value={query}
          onChange={onChange}
          ref={inputRef}
        />
        <DeleteInputContent onClick={onClick} />
      </div>
    </div>
  );
}

export default SelectUserLocationModalSearch;
