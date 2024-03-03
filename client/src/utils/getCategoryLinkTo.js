import URLActions from "./URLActions";
import { CATEGORY_CATALOG_ROUTE } from "./consts";
import encodeUrl from "./encodeUrl";

function getCategoryLinkTo(category, parentCategoryId = null, categories = null) {
  let to;

  if (category.isVariation && parentCategoryId && categories) {
    const basename = process.env.REACT_APP_CLIENT_URL;

    const parentCategory = categories.find(cat => cat.id === parentCategoryId);
    // when there's no more parentCategoryId then start ending the recursion below
    const parentCategoryTo = getCategoryLinkTo(parentCategory, parentCategory.parentCategoryId, categories);

    const relativeURL = parentCategoryTo;
    const href = basename + relativeURL;

    let newUrl = href;
    for (let [name, value] of Object.entries(category.queryParams)) {
      console.log(name, value);
      newUrl = URLActions.addParamValue(name, value, newUrl);
    }

    to = encodeUrl(newUrl.replace(basename, ""));
  } else {
    to = CATEGORY_CATALOG_ROUTE + `${category.id}-${category.slug}`;
  }
  
  return to;
}

export default getCategoryLinkTo;