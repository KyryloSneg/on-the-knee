import { Link } from "react-router-dom";
import "./styles/CategoriesPageItem.css";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import { useContext } from "react";
import { Context } from "../Context";

const CategoriesPageItem = ({ category, type, brand = null }) => {
  const { deviceStore } = useContext(Context);

  function getLinkTo() {
    let categoryCopy = {...category};
    if (type === "brand" && brand) {
      categoryCopy.queryParams = { ...categoryCopy.queryParams, brand: brand.name };
    }

    const categoryLink = getCategoryLinkTo(categoryCopy, category.parentCategoryId, deviceStore.categories);
    return categoryLink;
  }

  return (
    <Link to={getLinkTo()} className="categories-page-item">
      <div className="categories-page-img-wrap">
        <img src={category.image} alt="" draggable="false" />
      </div>
      <h3>{category.name}</h3>
    </Link>
  );
}

export default CategoriesPageItem;
