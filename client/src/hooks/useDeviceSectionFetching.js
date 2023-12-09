import _ from "lodash";
import { useEffect, useRef } from "react";
import { getDevices } from "../http/DeviceApi";
import { getStocks } from "../http/StocksAPI";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { FILTERS_IN_SPECIAL_COMPONENTS, SPECIAL_TO_HANDLE_FILTERS } from "../utils/consts";
import { getAttributesInfo } from "../http/AttributesAPI";
import { useLocation } from "react-router-dom";
import getDiscountedPrice from "../utils/getDiscountedPrice";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import DeviceComboActions from "../utils/DeviceComboActions";

// query params without pagination ones
function useDeviceSectionFetching(deviceStore, app, stringQueryParams = "", minQueryPrice = null, maxQueryPrice = null) {
  const location = useLocation();

  const prevUsedFilters = useRef(deviceStore.usedFilters);
  const isInitialFetch = !deviceStore.devices.length || deviceStore.usedFilters !== prevUsedFilters.current

  async function fetchingCallback() {
    if (isInitialFetch) {
      app.setIsGlobalLoading(true);
    }

    const start = deviceStore.limit * (deviceStore.page - 1);
    const limit = deviceStore.limit * deviceStore.pagesToFetch;

    const toFilterByPrice = minQueryPrice && maxQueryPrice;
    const toFilterByStock = !!deviceStore.usedFilters["stock"]?.length;

    const deviceFetchPath = `${stringQueryParams}`;
    const { devices } = await getDevices(deviceFetchPath);

    const stocks = await getStocks();
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();

    // TODO: add there other "special" filters (that requires separate implementation) later on
    const isSpecialFilters = toFilterByPrice || toFilterByStock;

    let filteredDevices = [...devices];
    let pageFilteredDevices = [];

    function filterDeviceCombinations(filterFn, array) {
      console.log(array);
      const filteredDevices = array.filter(dev => {
        // passing dev in the filterFn below to get access to it (like in filtering by price)
        const filteredCombos = dev["device-combinations"].filter((combo) => filterFn(combo, dev));
        // if device has no combos we don't push it to the filteredDevices array
        if (!filteredCombos.length) return false;
        
        const defaultCombo = filteredCombos.find(combo => combo.default);
        if (!defaultCombo?.length) {
          // setting a default combo (some random combination that left after the filtration)
          filteredCombos[0].default = true;
        }
        
        dev["device-combinations"] = filteredCombos;
        return true;
      });

      return filteredDevices;
    }

    if (toFilterByPrice) {
      filteredDevices = filterDeviceCombinations(
        (item, dev) => {
          const { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(dev, sales, saleTypeNames)

          let discountedPrice;
          if (discountPercentage) {
            discountedPrice = getDiscountedPrice(item.price, discountPercentage);
          }

          const priceToCompare = discountedPrice || item.price;
          return (priceToCompare >= minQueryPrice && priceToCompare <= maxQueryPrice)
        },
        [...devices],
      );
    }

    if (toFilterByStock) {
      // cloning filteredDevices array to prevent bugs
      // that can be possibly caused by changing it inside the loop

      filteredDevices = filterDeviceCombinations(
        item => {
          const stock = stocks.find(s => s["device-combinationId"] === item.id);
          return deviceStore.usedFilters["stock"].includes(stock.stockStatus);
        },
        [...filteredDevices],
      );
    }

    let deviceInfos = [];
    for (let dev of filteredDevices) {
      deviceInfos.push(...dev["device-infos"])
    }

    let attributes = [];
    if (isSpecialFilters) {

      for (let dev of filteredDevices) {
        for (let combination of dev["device-combinations"]) {
          // { combinationString: "phoneStorage:32 GB-color:purple#a020f0" }
          // attrs = [phoneStorage:32 GB, color:purple#a020f0]
          const attrs = combination.combinationString?.split("-");
          if (!attrs) continue;

          for (let attr of attrs) {
            // attr.split(":") = ["phoneStorage", "32 GB"]
            const [name, value] = attr.split(":");
            const structuredAttr = {
              deviceId: dev.id,
              name: name,
              value: value
            };

            const isAlreadyExists = !!attributes.find(attrToCheck => _.isEqual(attrToCheck, structuredAttr));
            if (!isAlreadyExists) attributes.push(structuredAttr);
          }
        }

      }

    } else {
      const allAttributes = await getAttributesInfo();
      for (let attr of allAttributes) {
        const structuredAttr = {
          deviceId: attr.deviceId,
          name: attr["attribute-name"].name,
          value: attr["attribute-value"].value,
        }

        attributes.push(structuredAttr);
      }
    }

    function pushValueToFiltersObj(filtersObj, name, value) {
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

    function pushFilters(filtersObj, array) {

      for (let info of array) {
        pushValueToFiltersObj(filtersObj, info.name, info.value);
      }

      for (let [key, value] of Object.entries(filtersObj)) {
        // delete filters that contains (<= 1) items
        if (value.length <= 1) delete filtersObj[key];
      }

    }

    let filters = {};

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
    }

    pushFilters(filters, deviceInfos);
    pushFilters(filters, attributes);

    let filtersWithoutSpecial = {};
    for (let [key, value] of Object.entries({ ...deviceStore.usedFilters })) {
      if (SPECIAL_TO_HANDLE_FILTERS.includes(key)) continue;
      filtersWithoutSpecial[key] = value;
    }

    function filterDevicesFn(device) {
      let allDeviceInfo = {};

      // adding every device info in the loop
      for (let info of device["device-infos"]) {
        // material: cotton
        allDeviceInfo[info.name] = [info.value];
      }

      const deviceAttributes = attributes.filter(attr => attr.deviceId === device.id);
      // adding every device attribute in the loop (if it has ones)
      for (let attr of deviceAttributes) {
        if (allDeviceInfo[attr.name]) {
          allDeviceInfo[attr.name].push(attr.value);
        } else {
          allDeviceInfo[attr.name] = [attr.value];
        }
      }

      for (let [key, values] of Object.entries(filtersWithoutSpecial)) {
        // usedFilters: { color: ["red"] }
        // infos: { material: ["cotton"], color: ["purple#121242", "red#121442"] }

        if (!allDeviceInfo[key]) return false;

        for (let info of allDeviceInfo[key]) {
          const infoToCheck = key === "color"
            ? info?.split("#")[0]
            : info;

          const isIncluded = values.includes(infoToCheck);
          if (!isIncluded) {
            if (allDeviceInfo[key].length === 1) return false;
            // else leaving only device combinations that have such an attribute
            else {
              device["device-combinations"] = device["device-combinations"].filter(combo => {
                const combinationStringAttrs = combo.combinationString.split("-");
                const [, value] = combinationStringAttrs.find(attr => attr.startsWith(`${key}:`)).split(":");

                // if the current combination contains attribute that is not included in the used filters,
                // delete it
                return value.toLowerCase() !== info.toLowerCase();
              });

              if (!device["device-combinations"].length) return false;

              const defaultCombo = device["device-combinations"].find(combo => combo.default);
              if (!defaultCombo) {
                // same as in the price filtering logic
                device["device-combinations"][0].default = true;
              }
            }
          }
        }

      }

      // if some device combinations are left, leave current device then
      return true;
    }

    if (Object.keys(filtersWithoutSpecial).length) {
      // if we have used filters, do filtration
      filteredDevices = filteredDevices.filter(filterDevicesFn);
    }
    // getting devices for the current page
    pageFilteredDevices = filteredDevices.slice(start, (start + limit));

    const { minPrice, maxPrice } = DeviceComboActions.getDeviceMinMaxPrices(filteredDevices, sales, saleTypeNames);
    if (minPrice !== deviceStore.initialMinPrice) {
      // rounding min and max numbers up to 2 digits after comma
      deviceStore.setInitialMinPrice((Math.round(minPrice * 100) / 100).toFixed(2));
    }

    if (maxPrice !== deviceStore.initialMaxPrice) {
      deviceStore.setInitialMaxPrice((Math.round(maxPrice * 100) / 100).toFixed(2));
    }

    deviceStore.setDevices(pageFilteredDevices);
    deviceStore.setDeviceInfos(deviceInfos);
    // filters are almost just the same as device infos but later on they will have device attributes
    deviceStore.setFilters(filters);
    deviceStore.setTotalCount(filteredDevices.length);

    if (!_.isEqual(deviceStore.stocks.slice(), stocks)) {
      deviceStore.setStocks(stocks);
    }

    if (!_.isEqual(deviceStore.sales.slice(), sales)) {
      deviceStore.setSales(sales);
    }

    if (!_.isEqual(deviceStore.saleTypeNames.slice(), saleTypeNames)) {
      deviceStore.setSaleTypeNames(saleTypeNames);
    }

    prevUsedFilters.current = deviceStore.usedFilters;
  }

  function finallyCallback() {
    if (isInitialFetch) {
      app.setIsGlobalLoading(false);
    }
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback, 0, finallyCallback);

  useEffect(() => {
    fetching();
    // do not use fetching in dependency list
    // eslint-disable-next-line
  }, [
    deviceStore.stocks, deviceStore.sales,
    deviceStore.saleTypeNames, deviceStore.limit,
    deviceStore.page, deviceStore.pagesToFetch,
    // if param queries have changed, re-fetch devices
    location.search,
    // deviceStore.usedFilters
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;