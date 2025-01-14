import URLActions from "./URLActions";
import { CATEGORY_CATALOG_ROUTE, CLIENT_URL } from "./consts";
import encodeUrl from "./encodeUrl";

function getCategoryLinkTo(category, parentCategoryId = null, categories = null) {
  let to;

  if (category.queryParams || category.isVariation) {
    const basename = CLIENT_URL;

    let relativeURL = "";
    // if we want to just set query params without finding parent category
    if (category.queryParams && !category.isVariation) {
      relativeURL = CATEGORY_CATALOG_ROUTE + `${category.id}--${category.slug}`;
    } else if (category.isVariation && parentCategoryId && categories) {
      const parentCategory = categories.find(cat => cat.id === parentCategoryId);
      // when there's no more parentCategoryId then start ending the recursion below
      const parentCategoryTo = getCategoryLinkTo(parentCategory, parentCategory.parentCategoryId, categories);
      relativeURL = parentCategoryTo;
    }

    const href = basename + relativeURL;
    let newUrl = href;

    for (let [name, value] of Object.entries(category.queryParams)) {
      newUrl = URLActions.addParamValue(name, value, newUrl);
    }

    newUrl = URLActions.setNewParam("page", "1", newUrl);
    newUrl = URLActions.setNewParam("pagesToFetch", "1", newUrl);

    to = encodeUrl(newUrl.replace(basename, ""));
  } else {
    to = CATEGORY_CATALOG_ROUTE + `${category.id}--${category.slug}?page=1&pagesToFetch=1`;
  }
  
  return to;
}

export default getCategoryLinkTo;