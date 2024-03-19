import { useContext } from "react";
import { Context } from "../Context";
import StringActions from "../utils/StringActions";
import useBrandDevicesFetching from "../hooks/useBrandDevicesFetching";
import CategoriesPageItem from "../components/CategoriesPageItem";
import './styles/CategoriesPage.css';
import { observer } from "mobx-react-lite";

const CategoriesPage = observer(({ type, categoryId = null, brandId = null }) => {
  const { deviceStore } = useContext(Context);
  const [, , , brandDevices] = useBrandDevicesFetching(brandId) || [];

  let headerText = "";

  let category;
  let brand;

  if (type === "category") {
    category = deviceStore.categories.find(cat => cat.id === categoryId);
  } else {
    brand = deviceStore.brands.find(brandItem => brandItem.id === brandId);
  }

  headerText = type === "category"
    ? `${StringActions.capitalize(category.name)}`
    : `Devices of ${StringActions.capitalize(brand.name)}`;

  let categoriesToRender = [];
  if (type === "category") {
    categoriesToRender = deviceStore.categories.filter(cat => !cat.isVariation && cat.parentCategoryId === categoryId);
  } else if (type === "brand" && brandDevices?.length) {
    let brandCategoriesIds = brandDevices.map(dev => dev.categoryId);
    brandCategoriesIds = Array.from(new Set(brandCategoriesIds));

    categoriesToRender = deviceStore.categories.filter(cat => brandCategoriesIds.includes(cat.id));
  }

  return (
    <main className="categories-page">
      <h2>{headerText}</h2>
      <ul className="categories-page-list">
        {categoriesToRender.map(category =>
          <li key={category.id}>
            <CategoriesPageItem category={category} type={type} brand={brand} />
          </li>
        )}
      </ul>
    </main>
  );
});

export default CategoriesPage;
