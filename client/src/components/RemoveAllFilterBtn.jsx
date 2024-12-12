import "./styles/RemoveAllFilterBtn.css";
import { Link } from "react-router-dom";
import URLActions from "../utils/URLActions";

const RemoveAllFilterBtn = () => {
  let to = URLActions.deleteAllDefaultParamValues();
  to = URLActions.getURLWithResettedPageRelatedParams(to);
  
  return (
    <li>
      <Link to={to} id="remove-all-filters" data-testid="remove-all-filters" preventScrollReset={true}>
        Remove all filters
      </Link>
    </li>
  );
};

export default RemoveAllFilterBtn;
