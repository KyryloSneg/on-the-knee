import { Link } from "react-router-dom";
import "./styles/CategoriesModalItem.css";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";

const CategoriesModalItem = ({ category }) => {
  const to = getCategoryLinkTo(category);

  return (
    <Link to={to} className="categories-modal-item">
      <img src={category.image} alt="" draggable="false"/>
      <span>{category.name}</span>
    </Link>
  );
}

export default CategoriesModalItem;
