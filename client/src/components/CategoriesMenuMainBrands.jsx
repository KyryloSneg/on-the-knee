import { useContext } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";
import { BRAND_CATALOG_ROUTE } from "../utils/consts";
import "./styles/CategoriesMenuMainBrands.css";

const CategoriesMenuMainBrands = ({ selectedId }) => {
  const { deviceStore } = useContext(Context);
  const mainCategory = deviceStore.categories.find(category => category.id === selectedId);

  return (
    <ul className="categories-menu-main-brands">
      {mainCategory.mainBrands.map(id => {
        const brand = deviceStore.brands.find(brand => brand.id === id);
        const to = `${BRAND_CATALOG_ROUTE}${id}-${brand.slug}`;
        
        return (
          <li key={id}>
            <Link to={to} className="categories-menu-main-brand">
              <img src={brand.logo} alt={brand.name} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default CategoriesMenuMainBrands;
