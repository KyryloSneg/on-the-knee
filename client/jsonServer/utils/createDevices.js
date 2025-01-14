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
const createDeviceQuestions = require("./createDeviceQuestions");
const createDeviceFeedbackRates = require("./createDeviceFeedbackRates");
const createDeviceQuestionRates = require("./createDeviceQuestionRates");

module.exports = async () => {

  const dummyDevices = await getAllDevices();
  const dummyCategorySlugs = await getAllCategorySlugs();
  const dummyUnfilteredBrandNames = dummyDevices.map(d => d.brand);

  let dummyBrandNames = [];
  for (let brand of dummyUnfilteredBrandNames) {
    if (dummyBrandNames.includes(brand) || typeof brand !== "string") continue;
    dummyBrandNames.push(brand);
  }

  const brands = createBrands(dummyBrandNames);
  let categoryObjects = [];

  for (let slug of dummyCategorySlugs) {
    const categoryObj = { slug: slug, type: "category" };
    categoryObjects.push(categoryObj);
  }

  // // we can do anything here just to make layout of future brand categories
  // for (let brand of brands) {
  //   const isBrandInCategory = faker.datatype.boolean(0.5);
  //   if (!isBrandInCategory) continue;

  //   // const categoryBrandObj = { slug: brand.slug, name: brand.name, type: "brand", brand: brand };
  //   const categoryBrandObj = { slug: null, name: null, type: "brand", brand: null };
  //   categoryObjects.push(categoryBrandObj);
  // }

  let sellerQuestions = [];

  let categories = createCategories(categoryObjects);
  const { sellers, sellerFeedbacks } = createSellers(sellerQuestions);

  let devices = [];
  let deviceFeedbacks = [];
  let deviceFeedbackLikes = [];
  let deviceFeedbackDislikes = [];
  let deviceFeedbackReplies = [];
  let deviceQuestionLikes = [];
  let deviceQuestionDislikes = [];
  let deviceQuestions = [];
  let deviceAnswers = [];
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

  let categoriesLeft = [...categories];
  let brandsLeft = [...brands];

  dummyDevices.map((dev, i) => {
    dev.id = faker.string.uuid();

    let category;
    if (categoriesLeft.length) {
      category = categoriesLeft[faker.number.int({ min: 0, max: categoriesLeft.length - 1 })];
    } else {
      category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    }

    let brand;
    if (categoriesLeft.length) {
      brand = brandsLeft[faker.number.int({ min: 0, max: brandsLeft.length - 1 })];
    } else {
      brand = brands[faker.number.int({ min: 0, max: brands.length - 1 })];
    }

    // const brand = brands[faker.number.int({ min: 0, max: brands.length - 1 })];
    // const category = categories[faker.number.int({ min: 0, max: categories.length - 1 })];
    const seller = sellers[faker.number.int({ min: 0, max: sellers.length - 1 })];

    const { deviceAttributeValues } = createAttributes(dev.id, category.slug, attributes, attributeNames, attributeValues);
    const isPreOrder = faker.datatype.boolean(0.1);

    createDeviceInfos(dev.id, category.slug, deviceInfos, deviceAttributeValues);
    createDeviceCombinations(dev, deviceAttributeValues, deviceCombinations, stocks, isPreOrder);
    createAdditionalServices(dev.id, devices, additionalServices, additionalServiceDevices, deviceCombinations);

    const rating = createDeviceFeedbacks(deviceFeedbacks, deviceFeedbackReplies, dev.id);
    createDeviceQuestions(deviceQuestions, deviceAnswers, dev.id);

    const device = {
      "id": dev.id,
      "name": dev.title,
      "rating": rating,
      "description": dev.description,
      "brandId": brand.id,
      "categoryId": category.id,
      "sellerId": seller.id,
      "isPreOrder": isPreOrder
    };

    devices.push(device);

    categoriesLeft = categoriesLeft.filter(cat => cat.id !== category.id);
    brandsLeft = brandsLeft.filter(brandItem => brandItem.id !== brand.id);
  });

  for (let category of categories) {
    const devicesInCategory = devices.filter(dev => dev.categoryId === category.id);
    if (!devicesInCategory.length) continue;

    const isToAddBrandCategory = faker.datatype.boolean(0.6);
    if (!isToAddBrandCategory) continue;

    const brandIdsInCategory = Array.from(new Set(devicesInCategory.map(dev => dev.brandId)));

    let amount;
    if (brandIdsInCategory.length - 1 > 2) {
      amount = 2;
    } else {
      amount = brandIdsInCategory.length - 1;
    }

    let leftBrandIds = [...brandIdsInCategory];
    const idsToCreateCategories = [];
    for (let i = 0; i <= amount - 1; i++) {
      const randomIndex = faker.number.int({ min: 0, max: amount - 1 });
      const brandId = leftBrandIds[randomIndex];
      idsToCreateCategories.push(brandId);

      leftBrandIds = leftBrandIds.filter(id => id !== brandId);
    }

    const categoryObjects = idsToCreateCategories.map(id => {
      const brand = brands.find(brand => brand.id === id);
      return { slug: brand.slug, name: brand.name, type: "brand", brand: brand, parentCategoryId: category.id };
    });

    const brandCategories = createCategories(categoryObjects, categories.length - 1);
    categories = categories.concat(brandCategories);
  }

  let categoriesMaxMainBrandsAmount = {};
  for (let category of categories) {
    if (category.parentCategoryId !== null) continue;

    const mainBrandsAmount = faker.number.int({ min: 2, max: 6 });
    categoriesMaxMainBrandsAmount[category.id] = mainBrandsAmount;
  }

  function findParentMainCategory(category) {
    let parentId = category.parentCategoryId;
    let parentMainCategory = categories.find(cat => cat.id === parentId);

    while (parentId !== null && parentId !== undefined) {
      parentMainCategory = categories.find(cat => cat.id === parentId);
      parentId = parentMainCategory?.parentCategoryId;
    }

    return parentMainCategory || category;
  }

  for (let dev of devices) {
    const category = categories.find(cat => cat.id === dev.categoryId);

    // only main categories can have main brands
    const parentMainCategory = findParentMainCategory(category);
    const mainBrands = parentMainCategory.mainBrands;

    if (mainBrands.length > categoriesMaxMainBrandsAmount[parentMainCategory.id]) continue;
    if (!mainBrands.includes(dev.brandId)) mainBrands.push(dev.brandId);
  }

  const saleDevices = createSaleDevices(sales, devices);
  // createDeviceFeedbackRates(deviceFeedbacks, deviceFeedbackLikes, deviceFeedbackDislikes);
  createDeviceQuestionRates(deviceQuestions, deviceQuestionLikes, deviceQuestionDislikes);

  return {
    devices,
    deviceFeedbacks,
    deviceFeedbackLikes,
    deviceFeedbackDislikes,
    deviceQuestionLikes,
    deviceQuestionDislikes,
    deviceFeedbackReplies,
    deviceQuestions,
    deviceAnswers,
    deviceInfos,
    deviceCombinations,

    stocks,

    brands,
    categories,

    sellers,
    sellerFeedbacks,
    sellerQuestions,

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