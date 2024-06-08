import { Link } from "react-router-dom";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import "./styles/ChildCategory.css";

const ChildCategory = ({ category }) => {
  const to = getCategoryLinkTo(category);

  function onClick() {
    window.scrollTo(0, 0);
  }

  return (
    <Link to={to} onClick={onClick} className="child-category">
      <div className="child-category-img-wrap">
        <img src={category.image} alt="" draggable="false" />
      </div>
      <h3>{category.name}</h3>
    </Link>
  );
}

export default ChildCategory;
