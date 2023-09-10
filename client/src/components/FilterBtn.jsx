import removeIcon from "../assets/remove.svg";
import URLActions from "../utils/URLActions";
import "./styles/FilterBtn.css";
import { Link } from "react-router-dom";

const FilterBtn = ({ value, paramKey, testId }) => {
  const to = URLActions.deleteParamValue(paramKey, value);

  return (
    <Link to={to} className="remove-filter" data-testid={testId}>
      {paramKey !== "price" ? value : `${value}$`}
      <img src={removeIcon} className="no-select" draggable="false" alt="" />
    </Link>
  );
}

export default FilterBtn;
