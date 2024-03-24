import { Link } from "react-router-dom";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import "./styles/ChildCategory.css";

const ChildCategory = ({ category }) => {
  const to = getCategoryLinkTo(category);

  return (
    <Link to={to} className="child-category">
      <div className="child-category-img-wrap">
        <img src={category.image} alt="" draggable="false" />
      </div>
      <h3>{category.name}</h3>
    </Link>
  );
}

export default ChildCategory;
