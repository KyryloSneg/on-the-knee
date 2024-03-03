import React, { useContext } from 'react';
import CatalogPage from './CatalogPage';
import { useParams } from 'react-router-dom';
import { Context } from '../Context';
import CategoriesPage from './CategoriesPage';
import { MIN_CATEGORIES_LENGTH_TO_RENAVIGATE } from '../utils/consts';

const RenavigatingCatalogPage = ({ type }) => {
  // relocate user to the catalog page or to the subcategories select page
  // (if user has navigated to the categories catalog route)
  const { deviceStore } = useContext(Context);
  const { categoryIdSlug } = useParams();

  if ((type === "brand" || type === "search") && !categoryIdSlug) return <CatalogPage type={type} />
  const id = +categoryIdSlug.split("-")[0];
  const childCategories = deviceStore.categories.filter(cat => cat.parentCategoryId === id);

  if (childCategories.length >= MIN_CATEGORIES_LENGTH_TO_RENAVIGATE) {
    return <CategoriesPage />;
  } else {
    return <CatalogPage type={type} />
  }
}

export default RenavigatingCatalogPage;
