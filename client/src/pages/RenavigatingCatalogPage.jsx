import { useContext } from 'react';
import CatalogPage from './CatalogPage';
import { useLocation, useParams } from 'react-router-dom';
import { Context } from '../Context';
import CategoriesPage from './CategoriesPage';
import { MIN_CATEGORIES_LENGTH_TO_RENAVIGATE } from '../utils/consts';
import { observer } from 'mobx-react-lite';

const RenavigatingCatalogPage = observer(({ type }) => {
  // relocate user to the catalog page or to the subcategories select page
  // (if user has navigated to the categories catalog route)
  const { deviceStore } = useContext(Context);
  const { categoryIdSlug, brandIdSlug } = useParams();
  const location = useLocation();

  if (!deviceStore.categories?.length && !deviceStore.brands?.length) return <main />;
  if (type === "search" && !categoryIdSlug && !brandIdSlug) return <CatalogPage type={type} />;
  
  const brandId = brandIdSlug?.split("--")[0] || null;
  const categoryId = categoryIdSlug?.split("--")[0] || null;
  const childCategories = deviceStore.categories.filter(cat => !cat.isVariation && cat.parentCategoryId === categoryId);

  // "!location.search" means that that query params like "brand" were not passed
  if ((childCategories.length >= MIN_CATEGORIES_LENGTH_TO_RENAVIGATE && !location.search) || (type === "brand")) {
    return <CategoriesPage type={type} categoryId={categoryId} brandId={brandId} />;
  } else {
    return <CatalogPage type={type} />
  }
});

export default RenavigatingCatalogPage;
