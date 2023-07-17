const { faker } = require("@faker-js/faker");

module.exports = (categoryValues) => {
  let devCategories = [];

  for (let i = 1; i <= categoryValues.length; i++) {
    const category = {
      "id": i,
      "createdAt": faker.date.recent(),
      "name": categoryValues[i - 1]
    } 

    devCategories.push(category);
  }

  return devCategories;
}