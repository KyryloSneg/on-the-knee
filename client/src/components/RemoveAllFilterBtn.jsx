import { useContext } from "react";
import { Context } from "../index";
import "./styles/RemoveAllFilterBtn.css";

const RemoveAllFilterBtn = () => {
  const { filtersStore } = useContext(Context);

  function onClick() {
    filtersStore.setFilters({});
  }

  return (
    <li>
      <button id="remove-all-filters" onClick={onClick}>
        Remove all filters
      </button>
    </li>
  );
}

export default RemoveAllFilterBtn;
