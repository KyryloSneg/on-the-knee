import "./styles/RemoveAllFilterBtn.css";
import { Link } from "react-router-dom";
import URLActions from "../utils/URLActions";

const RemoveAllFilterBtn = () => {
  const to = URLActions.deleteAllDefaultParamValues();

  return (
    <li>
      <Link to={to} id="remove-all-filters" data-testid="remove-all-filters">
        Remove all filters
      </Link>
    </li>
  );
}

export default RemoveAllFilterBtn;
