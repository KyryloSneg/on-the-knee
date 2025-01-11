import { useContext } from "react";
import { Context } from "../Context";
import StringActions from "../utils/StringActions";
import useBrandDevicesFetching from "../hooks/useBrandDevicesFetching";
import CategoriesPageItem from "../components/CategoriesPageItem";
import './styles/CategoriesPage.css';
import { observer } from "mobx-react-lite";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import ApiError from "utils/ApiError";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const CategoriesPage = observer(({ type, categoryId = null, brandId = null }) => {
  const { deviceStore } = useContext(Context);
  const [, , , brandDevices] = useBrandDevicesFetching(brandId) || [];

  let headerText = "";

  let category;
  let brand;

  if (type === "category") {
    category = deviceStore.categories?.find(cat => cat.id === categoryId);
  } else {
    brand = deviceStore.brands?.find(brandItem => brandItem.id === brandId);
  }

  let documentTitle = null;
  let metaDescription = "";
  let metaKeywords = "";
  
  if (type === "category") {
    documentTitle = "Categories";

    if (category?.name) {
      metaDescription = `${category.name} in On the knee store. High quality, delivery, favorable prices $, huge discounts %`;
      metaKeywords = `categories, ${category.name}`;
    }
  } else if (type === "brand") {
    documentTitle = "Brands";

    if (brand?.name) {
      metaDescription = `${brand.name} in On the knee store. High quality, delivery, favorable prices $, huge discounts %`;
      metaKeywords = `brands, ${brand.name}`;
    }
  }

  useSettingDocumentTitle(documentTitle);

  if ((!category && deviceStore.categories?.length) && (!brand && deviceStore.brands?.length)) throw ApiError.NotFoundError();

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
      <MetaTagsInPublicRoute 
        description={metaDescription} 
        keywords={metaKeywords} 
        isToRender={metaDescription && metaKeywords}
      />
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
