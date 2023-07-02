import { useContext } from "react";
import { Context } from "../Context";
import "./styles/RemoveAllFilterBtn.css";

const RemoveAllFilterBtn = () => {
  const { deviceStore } = useContext(Context);

  function onClick() {
    deviceStore.setUsedFilters({});
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
