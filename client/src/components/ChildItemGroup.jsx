import "./styles/ChildItemGroup.css";
import { Link } from "react-router-dom";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import { SALES_ROUTE } from "utils/consts";

const ChildItemGroup = ({ itemGroup, type }) => {
  let to = "#"; 
  let name = "";
  let image = "#";

  if (type === "categories") {
    to = getCategoryLinkTo(itemGroup);

    name = itemGroup.name;
    image = itemGroup.image;
  } else if (type === "sales") {
    // this name is our slug
    to = `${SALES_ROUTE}${itemGroup.name}?page=1&pagesToFetch=1`;

    name = itemGroup.nameToRender;
    image = itemGroup.image;
  }

  return (
    <Link to={to} className="child-item-group">
      <div className="child-item-group-img-wrap">
        <img src={image} alt="" draggable="false" />
      </div>
      <h3>{name}</h3>
    </Link>
  );
}

export default ChildItemGroup;
