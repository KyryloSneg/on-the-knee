function getDescendantCategories(parentCategoryId, categories, isTopCategory = true, descCategories = []) {
  const childCategories = categories.filter(cat => !cat.isVariation && cat.parentCategoryId === parentCategoryId);
  for (let category of childCategories) {
    getDescendantCategories(category.id, categories, false, descCategories);
  }

  if (isTopCategory) {
    return descCategories;
  } else {
    descCategories.push(parentCategoryId);
  }
}

export default getDescendantCategories;