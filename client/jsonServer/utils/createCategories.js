const { faker } = require("@faker-js/faker");
const { MIN_CATEGORY_IMAGE_WIDTH, MAX_CATEGORY_IMAGE_WIDTH, MIN_CATEGORY_IMAGE_HEIGHT, MAX_CATEGORY_IMAGE_HEIGHT, MAIN_CATEGORIES_AMOUNT, CATEGORIES_NEST_3_AMOUNT } = require("./consts");
const StringActions = require("./StringActions");

module.exports = (categorySlugObjects) => {
	let categories = [];

	for (let slugObj of categorySlugObjects) {
		let treeParentIds = null;
		let parentId = null;

		let queryParams = null;

		const width = faker.number.int({ min: MIN_CATEGORY_IMAGE_WIDTH, max: MAX_CATEGORY_IMAGE_WIDTH });
		const height = faker.number.int({ min: MIN_CATEGORY_IMAGE_HEIGHT, max: MAX_CATEGORY_IMAGE_HEIGHT });

		// the categories array length from which we start creating "nest level 3 (and more nested ones)" categories
		const startNestLevelThreeNum = CATEGORIES_NEST_3_AMOUNT + MAIN_CATEGORIES_AMOUNT;

		if (categories.length >= MAIN_CATEGORIES_AMOUNT && categories.length < startNestLevelThreeNum) {
			parentId = faker.number.int({ min: 1, max: 2 });
		} else if (categories.length >= startNestLevelThreeNum) {
			// startNestLevelThreeNum - 1
			parentId = faker.number.int({ min: MAIN_CATEGORIES_AMOUNT + 1, max: categories.length });
		}

		// treeParentIds could not have a "real" parentId, but i won't handle such a behaviour in the mock server
		// because it doesn't really affect overall categories' logic
		if (parentId) treeParentIds = [parentId];

		// every brand-type category will be a variation
		if (slugObj.type === "brand") {
			queryParams = { brand: slugObj.brand.slug };
			const isToPushTreeParentId = faker.datatype.boolean(0.7);

			if (isToPushTreeParentId) {
				let treeParentId;
				while (!treeParentId || treeParentId === parentId) {
					// startNestLevelThreeNum - 1
					treeParentId = faker.number.int({ min: 1, max: categories.length })
				}
				
				if (Array.isArray(treeParentIds)) {
					treeParentIds.push(treeParentId);
				} else {
					treeParentIds = [treeParentId];
				}
			}
		};

		const name = StringActions.slugToName(slugObj.slug);
		const category = {
			"id": categories.length + 1,
			"treeParentCategoriesIds": treeParentIds,
			"parentCategoryId": parentId,
			// "nestLevel": parentId ? categories[parentId - 1].nestLevel + 1 : 0,
			"name": name,
			"slug": slugObj.slug,
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