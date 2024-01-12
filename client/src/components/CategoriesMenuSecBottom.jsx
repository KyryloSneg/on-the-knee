import { useContext } from "react";
import getCategoryLinkTo from "../utils/getCategoryLinkTo";
import { Context } from "../Context";
import { Link } from "react-router-dom";
import "./styles/CategoriesMenuSecBottom.css";
import CategoriesMenuMainBrands from "./CategoriesMenuMainBrands";

const CategoriesMenuSecBottom = ({ selectedId }) => {
  const { deviceStore } = useContext(Context);

  const mainCategory = deviceStore.categories.find(category => category.id === selectedId);
  const allCategoriesTo = getCategoryLinkTo(mainCategory);

  return (
    <section className="categories-menu-bottom-bar">
      <Link to={allCategoriesTo} className="menu-all-categories">
        All categories
      </Link>
      <CategoriesMenuMainBrands selectedId={selectedId} />
    </section>
  );
}

export default CategoriesMenuSecBottom;
