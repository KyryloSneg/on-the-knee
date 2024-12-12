import _ from "lodash";
import { FILTERS_IN_SPECIAL_COMPONENTS } from "./consts";
import { filterDevicesBySpecialFilters } from "./filterDevicesBySpecialFilters";
import getUsedFiltersWithoutSpecial from "./getUsedFiltersWithoutSpecial";
import filterDevicesWithCommonFilters from "./filterDevicesWithCommonFilters";

export function pushValueToFiltersObj(filtersObj, name, value) {
  if (FILTERS_IN_SPECIAL_COMPONENTS.includes(name)) return;
  if (!filtersObj[name]) {
    filtersObj[name] = [{ "value": value, "count": 1 }];
    return;
  }
  const filtersValues = filtersObj[name].map(item => item.value);

  // if the current info value is in it's corresponding array in the filters, increment the value count
  if (filtersValues.includes(value)) {
    // finding info that we've just found to replace it with incremented count value
    filtersObj[name] = filtersObj[name].map(item => {
      if (item.value !== value) return item;

      return {
        "value": value,
        "count": item.count + 1
      };
    });
  } else {
    // else push it there with count 1
    filtersObj[name].push({
      "value": value,
      "count": 1
    });
  }
}

export function pushFilters(filtersObj, array) {
  for (let info of array) {
    pushValueToFiltersObj(filtersObj, info.name, info.value);
  }
}

export function clearFiltersFromEmptyValues(filtersObj, usedFilters) {
  for (let [key, value] of Object.entries(filtersObj)) {
    // delete filters that contains (<= 1) items and are not used atm of pushing
    if (value.length <= 1 && !usedFilters[key]) delete filtersObj[key];
    else {
      value = value.filter(item => !item.count);
    }
  }
}

export default function getDeviceFiltersObj(
  devices, stocks, sellers, brands, sales, saleTypeNames, minQueryPrice, 
  maxQueryPrice, allAttributes, usedFilters, isToPushSellers = true
) {
  function getFiltersObjCb(propsDevices) {
    let filters = {};

    let deviceInfos = [];
    if (!deviceInfos.length) {
      for (let dev of propsDevices) {
        deviceInfos.push(...dev["device-infos"])
      }
    }

    // pushing device combinations' stocks and device's sellers with brands
    let deviceIds = [];

    for (let dev of propsDevices) {
      deviceIds.push(dev.id);

      let stockStatuses = [];
      for (let combo of dev["device-combinations"]) {
        const stock = stocks.find(s => s["device-combinationId"] === combo.id);
        stockStatuses.push(stock.stockStatus);
      };
  
      const uniqueStatuses = Array.from(new Set(stockStatuses));
      for (let status of uniqueStatuses) {
        pushValueToFiltersObj(filters, "stock", status);
      }
  
      if (isToPushSellers) {
        const seller = sellers.find(s => s.id === dev.sellerId);
        pushValueToFiltersObj(filters, "seller", seller.name);
      }
  
      const brand = brands.find(b => b.id === dev.brandId);
      if (!!brand) pushValueToFiltersObj(filters, "brand", brand.name);
    }

    const infosWithoutAdditional = deviceInfos.filter(info => info.name !== "additionalInfo");
    const attributes = allAttributes.filter(attr => deviceIds.includes(attr.deviceId));

    pushFilters(filters, infosWithoutAdditional, usedFilters);
    pushFilters(filters, attributes, usedFilters);

    clearFiltersFromEmptyValues(filters, usedFilters);
    return filters;
  }

  function getSpeciallyFilteredDevsWithoutOneCategoryFilter(key, propsDevices = null) {
    let usedFiltersToApply = _.cloneDeep(usedFilters);
    delete usedFiltersToApply[key];

    let devicesToFilter = _.cloneDeep(propsDevices || devices);

    devicesToFilter = filterDevicesBySpecialFilters(
      devicesToFilter, stocks, sellers, brands, sales, saleTypeNames,
      minQueryPrice, maxQueryPrice, usedFiltersToApply
    ).devices;

    return devicesToFilter;
  }

  function getCommonlyFilteredDevsWithoutOneCategoryFilter(key, propsDevices = null) {
    let usedFiltersToApply = _.cloneDeep(usedFilters);
    delete usedFiltersToApply[key];

    let devicesToFilter = _.cloneDeep(propsDevices || devices);

    const filtersWithoutSpecial = getUsedFiltersWithoutSpecial(usedFiltersToApply);
    if (Object.keys(filtersWithoutSpecial).length) {
      // if we have used filters, do filtration
      devicesToFilter = devicesToFilter.filter(
        dev => filterDevicesWithCommonFilters(dev, allAttributes, filtersWithoutSpecial)
      );
    }

    return devicesToFilter;
  }

  function getFilteredByAllFiltersDevsWithoutOneCategoryFilter(key) {
    const speciallyFilteredDevs = getSpeciallyFilteredDevsWithoutOneCategoryFilter(key);
    const result = getCommonlyFilteredDevsWithoutOneCategoryFilter(key, speciallyFilteredDevs);

    return result;
  }

  const filtersWithAllDevices = getFiltersObjCb(devices);
  let resultFilters = {};
  
  for (let key of Object.keys(filtersWithAllDevices)) {
    // STEPS:
    // 1. filter devices without the filter in the current iteration
    // 2. get filters obj out of it 
    // (if the current filter is an attribute pass deviceInfos arg to the function that generates the object)
    // 3. set our value (filtersObj[key]) to the result filters

    // (it's not an optimal to way to do it ig, but idk how to implement it other way)
    const filteredDevicesWithoutCurrentFilter = getFilteredByAllFiltersDevsWithoutOneCategoryFilter(key);

    const filtersWithFilteredWithoutCurrentFilterDevs = getFiltersObjCb(filteredDevicesWithoutCurrentFilter);
    const valueToSet = filtersWithFilteredWithoutCurrentFilterDevs[key];

    if (valueToSet) {
      resultFilters[key] = valueToSet;
    }
  }

  return resultFilters;
}

