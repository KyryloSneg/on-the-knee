const { faker } = require("@faker-js/faker");
const { MIN_CATEGORY_IMAGE_WIDTH, MAX_CATEGORY_IMAGE_WIDTH, MIN_CATEGORY_IMAGE_HEIGHT, MAX_CATEGORY_IMAGE_HEIGHT, MAIN_CATEGORIES_AMOUNT, START_CATEGORIES_NEST_3_AMOUNT } = require("./consts");
const StringActions = require("./StringActions");

module.exports = (categoryObjects, categoriesLengthOffset = 0) => {
	let categories = [];

	for (let categoryObj of categoryObjects) {
		let treeParentIds = null;
		let parentId = categoryObj.parentCategoryId || null;

		let queryParams = null;

		const width = faker.number.int({ min: MIN_CATEGORY_IMAGE_WIDTH, max: MAX_CATEGORY_IMAGE_WIDTH });
		const height = faker.number.int({ min: MIN_CATEGORY_IMAGE_HEIGHT, max: MAX_CATEGORY_IMAGE_HEIGHT });

		// the categories array length from which we start creating "nest level 3 (and more nested ones)" categories
		const startNestLevelThreeNum = START_CATEGORIES_NEST_3_AMOUNT + MAIN_CATEGORIES_AMOUNT;

		if (!categoryObj.parentCategoryId && categoryObj.type !== "brand") {
			if (categories.length >= MAIN_CATEGORIES_AMOUNT && categories.length < startNestLevelThreeNum) {
				parentId = faker.number.int({ min: 1, max: MAIN_CATEGORIES_AMOUNT });
			} else if (categories.length >= startNestLevelThreeNum) {
				parentId = faker.number.int({ min: startNestLevelThreeNum - 1, max: categories.length });
			}
		}

		// treeParentIds could not have a "real" parentId, but i won't handle such a behaviour in the mock server
		// because it doesn't really affect overall categories' logic
		if (parentId || categoryObj.parentCategoryId) treeParentIds = [parentId || categoryObj.parentCategoryId];

		// every brand-type category will be a variation
		if (categoryObj.type === "brand") {
			// const decodedBrand = getDecodedURLParam(slugObj.brand.name);
			queryParams = { brand: categoryObj.name };
			// const isToPushTreeParentId = faker.datatype.boolean(0.7);

			// if (isToPushTreeParentId) {
			// 	let treeParentId;
			// 	while (!treeParentId || treeParentId === parentId) {
			// 		// startNestLevelThreeNum - 1
			// 		treeParentId = faker.number.int({ min: 1, max: categories.length })
			// 	}
				
			// 	if (Array.isArray(treeParentIds)) {
			// 		treeParentIds.push(treeParentId);
			// 	} else {
			// 		treeParentIds = [treeParentId];
			// 	}
			// }
		};

		const name = categoryObj.slug ? StringActions.slugToName(categoryObj.slug) : null;
		const category = {
			"id": categories.length + 1 + categoriesLengthOffset,
			"treeParentCategoriesIds": treeParentIds,
			"parentCategoryId": parentId,
			// "nestLevel": parentId ? categories[parentId - 1].nestLevel + 1 : 0,
			"name": name,
			"slug": categoryObj.slug,
			"image": faker.image.url({ width, height }),
			"icon": faker.image.url({ width: 24, height: 24 }),
			"queryParams": queryParams,
			"isVariation": !!queryParams,
			"isToShowVariations": faker.datatype.boolean(0.4),
			"mainBrands": []
		}

		categories.push(category);
	}

	return categories;
}