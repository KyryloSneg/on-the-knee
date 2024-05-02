import _ from "lodash";
import { useEffect, useRef } from "react";
import { getStocks } from "../http/StocksAPI";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { SPECIAL_TO_HANDLE_FILTERS } from "../utils/consts";
import { useLocation, useParams } from "react-router-dom";
import DeviceComboActions from "../utils/DeviceComboActions";
import { getSellers } from "../http/SellersAPI";
import URLActions from "../utils/URLActions";
import { filterDevicesByBrands, filterDevicesByPrice, filterDevicesBySellers, filterDevicesByStock } from "../utils/filterDevicesBySpecialFilters";
import getDeviceStructuredAttributes from "../utils/getDeviceStructuredAttributes";
import getDeviceFiltersObj from "../utils/getDeviceFiltersObj";
import filterDevicesWithCommonFilters from "../utils/filterDevicesWithCommonFilters";
import sortDevicesByPrice from "../utils/sortDevicesByPrice";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import getDescendantCategories from "../utils/getDescendantCategories";
import getDevicesBySearchQuery from "../utils/getDevicesBySearchQuery";

// query params without pagination ones
function useDeviceSectionFetching(deviceStore, app, type, setIsFoundDevicesByQuery = null, setSpellCheckedQuery = null) {
  const location = useLocation();
  const { categoryIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();
  
  const prevUsedFilters = useRef(deviceStore.usedFilters);
  const prevLocationPathname = useRef(location.pathname);

  const hasChangedURL = prevLocationPathname.current !== location.pathname;

  async function fetchingCallback(location, categoryIdSlug, hasChangedURL) {
    const isInitialFetch = !deviceStore.devices.length || !_.isEqual(deviceStore.usedFilters, prevUsedFilters.current) || hasChangedURL;
    
    try {
      if (isInitialFetch) {
        if (hasChangedURL) {
          deviceStore.setFilters({});
        }
  
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
  
      const categoryIdParam = URLActions.getParamValue("categoryId");
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
      if (categoryIdParam && type !== "category") fetchStringQueryParams += `&categoryId=${categoryIdParam}`.replaceAll(`"`, "");

      let devices = await getDevicesBySearchQuery(
        fetchStringQueryParams, type === "search", setIsFoundDevicesByQuery, setSpellCheckedQuery, navigate
      );

      if (type === "category") {
        const categoryId = +categoryIdSlug?.split("-")[0];
        let descendantCategories = getDescendantCategories(categoryId, deviceStore.categories);
        descendantCategories.push(categoryId);
  
        devices = devices.filter(dev => descendantCategories.includes(dev.categoryId));
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
      prevLocationPathname.current = location.pathname;
    } finally {
      if (isInitialFetch) {
        app.setIsGlobalLoading(false);
      }
    }
    
  }

  const [fetching, isLoading, error] = useFetching((location, categoryIdSlug, hasChangedURL) => fetchingCallback(location, categoryIdSlug, hasChangedURL));

  useEffect(() => {
    fetching(location, categoryIdSlug, hasChangedURL);
    // do not use fetching, stocks, sales and saleTypeNames in dependency list
    // eslint-disable-next-line
  }, [
    deviceStore.limit,
    deviceStore.page, 
    deviceStore.pagesToFetch,
    // deviceStore.usedFilters,
    // if param queries or pathname have changed, re-fetch devices
    location.search,
    location.pathname,
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;