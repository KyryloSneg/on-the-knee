const { faker } = require("@faker-js/faker");
const { MIN_CATEGORY_IMAGE_WIDTH, MAX_CATEGORY_IMAGE_WIDTH, MIN_CATEGORY_IMAGE_HEIGHT, MAX_CATEGORY_IMAGE_HEIGHT } = require("./consts");
const StringActions = require("./StringActions");

module.exports = (categorySlugs) => {
	let categories = [];

	for (let slug of categorySlugs) {
		let parentId = null;

		const width = faker.number.int({ min: MIN_CATEGORY_IMAGE_WIDTH, max: MAX_CATEGORY_IMAGE_WIDTH });
		const height = faker.number.int({ min: MIN_CATEGORY_IMAGE_HEIGHT, max: MAX_CATEGORY_IMAGE_HEIGHT });

		if (categories.length >= 4) {
			parentId = faker.number.int({ min: 1, max: categories.length });
		}

		const name = StringActions.slugToName(slug);
		const category = {
			"id": categories.length + 1,
			"parent-categoryId": parentId,
			"nestLevel": parentId ? categories[parentId - 1].nestLevel + 1 : 0,
			"name": name,
			"slug": slug,
			"image": faker.image.url({ width, height })
		}

		categories.push(category);
	}

	return categories;
}