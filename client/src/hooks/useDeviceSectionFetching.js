import _ from "lodash";
import { useEffect, useRef } from "react";
import { getStocks } from "../http/StocksAPI";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { SPECIAL_TO_HANDLE_FILTERS } from "../utils/consts";
import { useLocation } from "react-router-dom";
import DeviceComboActions from "../utils/DeviceComboActions";
import { getSellers } from "../http/SellersAPI";
import URLActions from "../utils/URLActions";
import { filterDevicesByBrands, filterDevicesByPrice, filterDevicesBySellers, filterDevicesByStock } from "../utils/filterDevicesBySpecialFilters";
import getDeviceStructuredAttributes from "../utils/getDeviceStructuredAttributes";
import getDeviceFiltersObj from "../utils/getDeviceFiltersObj";
import filterDevicesWithCommonFilters from "../utils/filterDevicesWithCommonFilters";
import sortDevicesByPrice from "../utils/sortDevicesByPrice";
import { getDevices } from "../http/DeviceApi";
import spellCheck from "../http/SaplingAPI";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";

// query params without pagination ones
function useDeviceSectionFetching(deviceStore, app, type, setIsFoundDevicesByQuery = null, setSpellCheckedQuery = null) {
  const location = useLocation();
  const navigate = useNavigateToEncodedURL();
  
  const prevUsedFilters = useRef(deviceStore.usedFilters);
  const isInitialFetch = !deviceStore.devices.length || deviceStore.usedFilters !== prevUsedFilters.current
  
  async function fetchingCallback() {
    if (isInitialFetch) {
      deviceStore.setDevices([]);
      deviceStore.setFilters({});
      app.setIsGlobalLoading(true);
    }
    
    const [minQueryPrice, maxQueryPrice] =
      URLActions.getParamValue("price")?.split("-").map(price => +price) || [];

    const start = deviceStore.limit * (deviceStore.page - 1);
    const limit = deviceStore.limit * deviceStore.pagesToFetch;
    
    const toFilterByPrice = minQueryPrice && maxQueryPrice;
    const toFilterByStock = !!deviceStore.usedFilters["stock"]?.length;
    const toFilterBySeller = !!deviceStore.usedFilters["seller"]?.length;
    const toFilterByBrand = !!deviceStore.usedFilters["brand"]?.length;

    const searchQuery = URLActions.getParamValue("text");
    const sortFilter = URLActions.getParamValue("sort");

    // device's name_like="check spelled user's search query" param
    let fetchStringQueryParams = ``;
    const splittedSortFilter = sortFilter?.split(",");

    if (!splittedSortFilter) {
      fetchStringQueryParams = `_sort=rating&_order=desc`;
    } else if (splittedSortFilter?.[1] === "rating") {
      fetchStringQueryParams = `_sort=rating&_order=${splittedSortFilter[0]}`;
    }

    if (type === "search") fetchStringQueryParams += `&name_like=${searchQuery}`.replaceAll(`"`, "");
    
    let spellCheckedSearchQuery = searchQuery;
    let { devices } = await getDevices(fetchStringQueryParams);

    if (!devices.length && type === "search") {
      spellCheckedSearchQuery = await spellCheck(searchQuery);

      const fetchParams = fetchStringQueryParams.split("&");
      fetchParams[2] = `name_like=${spellCheckedSearchQuery}`.replaceAll(`"`, "");

      fetchStringQueryParams = fetchParams.join("&");
      devices = (await getDevices(fetchStringQueryParams)).devices || [];
    }

    if (type === "search") {
      if (!devices.length) {
        devices = (await getDevices()).devices;
        // it looks ugly as hell
        // device found by its combination's sku or deviceCode
        let foundDevice = devices.find(dev => 
          !!dev["device-combinations"].find(combo => combo.sku === searchQuery || combo.deviceCode === +searchQuery)
        ) || null;
        
        if (foundDevice) {
          const combination = foundDevice["device-combinations"].find(combo => combo.sku === searchQuery || combo.deviceCode === +searchQuery);
          combination.default = true;
          foundDevice["device-combinations"] = [combination];
        }

        devices = foundDevice ? [foundDevice] : [];
        console.log(devices);
      }

      if (devices.length && !!spellCheckedSearchQuery && spellCheckedSearchQuery !== searchQuery) {
        const newUrl = URLActions.setNewParam("text", spellCheckedSearchQuery);

        const basename = process.env.REACT_APP_CLIENT_URL;
        navigate(newUrl.replace(basename, ""), { replace: true });
      }
      setIsFoundDevicesByQuery(!!devices.length);
    }

    if (!!spellCheckedSearchQuery && spellCheckedSearchQuery !== searchQuery) {
      setSpellCheckedQuery(spellCheckedSearchQuery);
    } else {
      setSpellCheckedQuery(searchQuery);
    }

    const stocks = await getStocks();
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();

    const sellers = await getSellers();
    const brands = deviceStore.brands;

    // TODO: add there other "special" filters (that requires separate implementation) later on
    const isSpecialFilters = toFilterByPrice || toFilterByStock || toFilterBySeller || toFilterByBrand;

    let filteredDevices = [...devices];
    let pageFilteredDevices = [];

    if (toFilterByStock) {
       filteredDevices = filterDevicesByStock(filteredDevices, stocks, deviceStore.usedFilters);
    }

    if (toFilterBySeller) {
      filteredDevices = filterDevicesBySellers(filteredDevices, sellers, deviceStore.usedFilters);
    }

    if (toFilterByBrand) {
      filteredDevices = filterDevicesByBrands(filteredDevices, brands, deviceStore.usedFilters);
    }

    // finding min / max prices before filtering by device's cost
    const { minPrice, maxPrice } = DeviceComboActions.getDeviceMinMaxPrices(filteredDevices, sales, saleTypeNames);
    if (toFilterByPrice) {
      filteredDevices = filterDevicesByPrice(devices, sales, saleTypeNames, minQueryPrice, maxQueryPrice);
    }

    let deviceInfos = [];
    for (let dev of filteredDevices) {
      deviceInfos.push(...dev["device-infos"])
    }

    const attributes = await getDeviceStructuredAttributes(isSpecialFilters, filteredDevices);
    const filters = getDeviceFiltersObj(devices, stocks, sellers, brands, deviceInfos, attributes);

    let filtersWithoutSpecial = {};
    for (let [key, value] of Object.entries({ ...deviceStore.usedFilters })) {
      if (SPECIAL_TO_HANDLE_FILTERS.includes(key)) continue;
      filtersWithoutSpecial[key] = value;
    }

    if (Object.keys(filtersWithoutSpecial).length) {
      // if we have used filters, do filtration
      filteredDevices = filteredDevices.filter(
        dev => filterDevicesWithCommonFilters(dev, attributes, filtersWithoutSpecial)
      );
    }

    if (splittedSortFilter?.[1] === "price") {
      sortDevicesByPrice(filteredDevices, stocks, sales, saleTypeNames, splittedSortFilter[0] === "desc");
    }

    // getting devices for the current page
    pageFilteredDevices = filteredDevices.slice(start, (start + limit));

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
    // do not use fetching, stocks, sales and saleTypeNames in dependency list
    // eslint-disable-next-line
  }, [
    deviceStore.limit,
    deviceStore.page, 
    deviceStore.pagesToFetch,
    // deviceStore.usedFilters,
    // if param queries have changed, re-fetch devices
    location.search,
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;