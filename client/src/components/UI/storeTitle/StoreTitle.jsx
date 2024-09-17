import "./StoreTitle.css";
import { Link } from "react-router-dom";
import { ROOT_ROUTE } from "../../../utils/consts";

const StoreTitle = ({ title }) => {
  return (
    <Link to={ROOT_ROUTE} className="no-select store-title">
      <h1>{title}</h1>
    </Link>
  );
}

export default StoreTitle;
