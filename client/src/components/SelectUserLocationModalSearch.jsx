import DeleteInputContent from "./UI/deleteInputContent/DeleteInputContent";
import "./styles/SelectUserLocationModalSearch.css"

const SelectUserLocationModalSearch = ({ setQuery }) => {
  function onClick() {
    setQuery("");
  }

  return (
    <div className="select-user-location-modal-search">
      <input type="search" />
      <DeleteInputContent onClick={onClick} />
    </div>
  );
}

export default SelectUserLocationModalSearch;
