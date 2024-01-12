import { Link } from "react-router-dom";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import "./styles/CategoriesMenuSecColBlock.css";
import { useContext } from "react";
import { Context } from "../Context";

const CategoriesMenuSecColBlock = ({ secondaryCategoriesObj, selectedId }) => {
  // secondaryCategoriesObj = { topCategory: {...}, nestedCategories: [{...}, {...}, ...] }
  const { deviceStore } = useContext(Context);

  const topCategoryTo = getCategoryLinkTo(
    secondaryCategoriesObj.topCategory, 
    secondaryCategoriesObj.topCategory.parentCategoryId,
    deviceStore.categories
  );
  
  return (
    <div className="category-menu-sec-col-block">
      <Link to={topCategoryTo} className="categories-menu-nest-2">
        {secondaryCategoriesObj.topCategory.name}
      </Link>
      <ul>
        {secondaryCategoriesObj.nestedCategories?.map(category => {
          const to = getCategoryLinkTo(category, category.parentCategoryId, deviceStore.categories);
          return (
            <li key={category.id}>
              <Link to={to} className="categories-menu-nest-3">
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoriesMenuSecColBlock;
