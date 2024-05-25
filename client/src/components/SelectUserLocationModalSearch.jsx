import DeleteInputContent from "./UI/deleteInputContent/DeleteInputContent";
import "./styles/SelectUserLocationModalSearch.css"

const SelectUserLocationModalSearch = ({ query, setQuery }) => {
  function onChange(e) {
    setQuery(e.target.value);
  }

  function onClick() {
    setQuery("");
  }

  return (
    <div className="select-user-location-modal-search">
      <input 
        type="search"
        placeholder="Search"
        aria-label="Search your location"
        autoComplete="off"
        value={query}
        onChange={onChange}
      />
      <DeleteInputContent onClick={onClick} />
    </div>
  );
}

export default SelectUserLocationModalSearch;
