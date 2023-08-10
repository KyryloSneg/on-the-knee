const { getAllDevices, getAllCategories } = require("../http/deviceAPI");
const { faker } = require('@faker-js/faker');
const createDeviceFeedbacks = require('./createDeviceFeedbacks');
const createBrands = require('./createBrands');
const createCategories = require('./createCategories');
const createSellers = require('./createSellers');
const createAttributes = require("./createAttributes");
const createDeviceInfos = require("./createDeviceInfos");
const createDeviceCombinations = require("./createDeviceCombinations");
const createAdditionalServices = require("./createAdditionalServices");
const createSales = require("./createSales");
const createSaleDevices = require("./createSaleDevices");

module.exports = async () => {

  const dummyDevices = await getAllDevices();
  const dummyCategorySlugs = await getAllCategories();
  const dummyUnfilteredBrandNames = dummyDevices.map(d => d.brand);

  let dummyBrandNames = [];  
  for (let brand of dummyUnfilteredBrandNames) {
    if (dummyBrandNames.includes(brand)) continue;
    dummyBrandNames.push(brand);
  }

  const brands = createBrands(dummyBrandNames);
  const categories = createCategories(dummyCategorySlugs, brands);
  const { sellers, sellerFeedbacks, sellerFeedbackReplies } = createSellers();

  let devices = [];
  let deviceFeedbacks = [];
  let deviceFeedbackReplies = [];
  let deviceInfos = [];
  let deviceCombinations = [];

  let stocks = [];

  let attributes = [];
  let attributeNames = [];
  let attributeValues = [];

  let additionalServices = [];
  let additionalServiceDevices = [];

  let sales = [];
  let saleTypes = [];
  let saleTypeNames = [];
  
  createSales(sales, saleTypes, saleTypeNames);
  
  dummyDevices.map((dev, i) => {
    const brand = brands[faker.number.int({ min: 0, max: brands.length - 1 })];
    const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    const seller = sellers[faker.number.int({ min: 0, max: sellers.length - 1 })];

    const rating = createDeviceFeedbacks(deviceFeedbacks, deviceFeedbackReplies, dev.id);
    const { deviceAttributeNames, deviceAttributeValues } = createAttributes(dev.id, category.slug, attributes, attributeNames, attributeValues);

    createDeviceInfos(dev.id, category.slug, deviceInfos, deviceAttributeNames);
    createDeviceCombinations(dev.id, deviceAttributeValues, deviceCombinations, stocks);
    createAdditionalServices(dev.id, devices, additionalServices, additionalServiceDevices);

    const device = {
      "id": dev.id,
      "name": dev.title,
      "rating": rating,
      "description": dev.description,
      "brandId": brand.id,
      "categoryId": category.id,
      "sellerId": seller.id,
      "isPreOrder": faker.number.int({ min: 1, max: 5 }) === 10, // 20% chance 
    }

    devices.push(device);
  });

  const saleDevices = createSaleDevices(sales, devices);

  return {
    devices,
    deviceFeedbacks,
    deviceFeedbackReplies,
    deviceInfos,
    deviceCombinations,

    stocks,

    brands,
    categories,

    sellers,
    sellerFeedbacks,
    sellerFeedbackReplies,

    attributes,
    attributeNames,
    attributeValues,

    additionalServices,
    additionalServiceDevices,

    sales,
    saleTypeNames,
    saleTypes,
    saleDevices,
  }

} 