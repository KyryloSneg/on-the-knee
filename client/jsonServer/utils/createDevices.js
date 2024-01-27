const { getAllDevices, getAllCategorySlugs } = require("../http/deviceAPI");
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
const { MAIN_CATEGORIES_AMOUNT } = require("./consts");

module.exports = async () => {

  const dummyDevices = await getAllDevices();
  const dummyCategorySlugs = await getAllCategorySlugs();
  const dummyUnfilteredBrandNames = dummyDevices.map(d => d.brand);

  let dummyBrandNames = [];  
  for (let brand of dummyUnfilteredBrandNames) {
    if (dummyBrandNames.includes(brand)) continue;
    dummyBrandNames.push(brand);
  }

  const brands = createBrands(dummyBrandNames);
  let categorySlugs = [];

  for (let slug of dummyCategorySlugs) {
    const slugObj = { slug: slug, type: "category" };
    categorySlugs.push(slugObj);
  }

  for (let brand of brands) {
    const isBrandInCategory = faker.datatype.boolean(0.5);
    if (!isBrandInCategory) continue;

    const slugObj = { slug: brand.slug, type: "brand", brand: brand };
    categorySlugs.push(slugObj);
  }

  const categories = createCategories(categorySlugs, brands);
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
    const category = categories[faker.number.int({ min: MAIN_CATEGORIES_AMOUNT + 1, max: categories.length - 1 })];
    const seller = sellers[faker.number.int({ min: 0, max: sellers.length - 1 })];

    const rating = createDeviceFeedbacks(deviceFeedbacks, deviceFeedbackReplies, dev.id);
    const { deviceAttributeValues } = createAttributes(dev.id, category.slug, attributes, attributeNames, attributeValues);

    createDeviceInfos(dev.id, category.slug, deviceInfos, deviceAttributeValues);
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
    };

    devices.push(device);
  });

  let categoriesMaxMainBrandsAmount = {};
  for (let category of categories) {
    if (category.parentCategoryId !== null) continue;

    const mainBrandsAmount = faker.number.int({ min: 2, max: 6 });
    categoriesMaxMainBrandsAmount[category.id] = mainBrandsAmount;
  }

  function findParentMainCategory(category) {
    let parentId = category.parentCategoryId;
    let parentMainCategory = categories.find(cat => cat.id === parentId);

    while (parentId !== null) {
      parentMainCategory = categories.find(cat => cat.id === parentId);
      parentId = parentMainCategory.parentCategoryId;
    }

    return parentMainCategory || category;
  }

  for (let dev of devices) {
    const category = categories.find(cat => +cat.id === +dev.categoryId);
    
    // only main categories can have main brands
    const parentMainCategory = findParentMainCategory(category);
    const mainBrands = parentMainCategory.mainBrands;

    if (mainBrands.length > categoriesMaxMainBrandsAmount[parentMainCategory.id]) continue;
    if (!mainBrands.includes(dev.brandId)) mainBrands.push(dev.brandId);
  }

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