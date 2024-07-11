import { FILTERS_IN_SPECIAL_COMPONENTS } from "./consts";

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

  for (let [key, value] of Object.entries(filtersObj)) {
    // delete filters that contains (<= 1) items
    if (value.length <= 1) delete filtersObj[key];
  }

}

export default function getDeviceFiltersObj(devices, stocks, sellers, brands, deviceInfos, attributes, isToPushSellers = true) {
  let filters = {};

  // pushing device combinations' stocks and device's sellers with brands
  for (let dev of devices) {
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
    if (brand) pushValueToFiltersObj(filters, "brand", brand.name);
  }

  const infosWithoutAdditional = deviceInfos.filter(info => info.name !== "additionalInfo");
  pushFilters(filters, infosWithoutAdditional);
  pushFilters(filters, attributes);

  return filters;
}

