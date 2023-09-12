import "./styles/RemoveAllFilterBtn.css";
import { Link } from "react-router-dom";
import URLActions from "../utils/URLActions";
import { useContext } from "react";
import { Context } from "../Context";

const RemoveAllFilterBtn = () => {
  const { app } = useContext(Context);
  const to = URLActions.deleteAllDefaultParamValues();

  return (
    <li>
      <Link to={to} id="remove-all-filters" data-testid="remove-all-filters" ref={app.asideBeginningRef}>
        Remove all filters
      </Link>
    </li>
  );
};

export default RemoveAllFilterBtn;
