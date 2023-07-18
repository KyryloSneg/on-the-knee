const { faker } = require('@faker-js/faker');
const findAverageNum = require('./findAverageNum');
const createDeviceRatings = require('./createDeviceRatings');
const createDeviceColor = require('./createDeviceColor');
const createDeviceInfos = require('./createDeviceInfos');
const { getAllProducts, getAllProductCategories } = require('../http/deviceAPI');
const createBrands = require('./createBrands');
const createCategories = require('./createCategories');

async function createDevices() {
  const dummyJsonDevices = await getAllProducts();
  const categoryValues = await getAllProductCategories();

  const { brandValues, brands } = createBrands(dummyJsonDevices.products);
  const categories = createCategories(categoryValues);

  let devices = [];
  let ratings = [];
  let colors = [];
  let infos = [];

  let ratingId = 1;

  for (let i = 1; i <= 100; i++) {
    const baseMpn = faker.number.int({min: 100, max: 999});
    const category = dummyJsonDevices.products[i - 1].category;

    const deviceRatingsValues = createDeviceRatings(ratings, ratingId, i); // ratings of the device of current iteration
    const deviceColor = createDeviceColor(colors, i, i, dummyJsonDevices.products[i - 1].images, baseMpn);
    
    const categoryId = categoryValues.indexOf(category) + 1;
    const brandId = brandValues.indexOf(dummyJsonDevices.products[i - 1].brand) + 1;
    
    const deviceInfos = createDeviceInfos(infos, category, i, i);

    const device = {
      "id": i,
      "createdAt": faker.date.recent(),
      "title": dummyJsonDevices.products[i - 1].title,
      "price": dummyJsonDevices.products[i - 1].price,
      "discountPercentage": dummyJsonDevices.products[i - 1].discountPercentage,
      "ratingValue": findAverageNum(deviceRatingsValues),
      "ratingAmount": deviceRatingsValues.length,
      "stock": i % 5 === 0 ? 0 : faker.number.int({min: 1, max: 200}),
      "categoryId": categoryId,
      "brandId": brandId,
      "colorId": deviceColor.id,
      // device info will be array because it doesn't work in any other way, so in order to get it you need to use 0 index
      "deviceInfosId": deviceInfos.id, 
      "thumbnail": dummyJsonDevices.products[i - 1].thumbnail,
      // images of 'default' color (right now ther's no difference) 
      "images": dummyJsonDevices.products[i - 1].images,
    }

    devices.push(device);
  }

  return {
    devices,
    ratings,
    categories,
    brands,
    colors,
    infos,
  };
}

module.exports = createDevices;