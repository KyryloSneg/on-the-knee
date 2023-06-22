import { Link } from "react-router-dom";
import "./StoreTitle.css";

const StoreTitle = ({ title }) => {
  return (
    <Link to="/" className="no-select store-title">
      <h1>{title}</h1>
    </Link>
  );
}

export default StoreTitle;
