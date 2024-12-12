import _ from "lodash";
import { useContext, useEffect, useRef } from "react";
import { getStocks } from "../http/StocksAPI";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { useLocation, useParams } from "react-router-dom";
import { getSellers } from "../http/SellersAPI";
import URLActions from "../utils/URLActions";
import { filterDevicesByOneSeller, filterDevicesBySpecialFilters } from "../utils/filterDevicesBySpecialFilters";
import getDeviceStructuredAttributes from "../utils/getDeviceStructuredAttributes";
import getDeviceFiltersObj from "../utils/getDeviceFiltersObj";
import filterDevicesWithCommonFilters from "../utils/filterDevicesWithCommonFilters";
import sortDevicesByPrice from "../utils/sortDevicesByPrice";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import getDescendantCategories from "../utils/getDescendantCategories";
import getDevicesBySearchQuery from "../utils/getDevicesBySearchQuery";
import getPreparedForMockServerStr from "../utils/getPreparedForMockServerStr";
import { Context } from "Context";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import getUsedFiltersWithoutSpecial from "utils/getUsedFiltersWithoutSpecial";

// query params without pagination ones
function useDeviceSectionFetching(
  originalType, setIsFoundDevicesByQuery = null, 
  setSpellCheckedQuery = null, seller = null, 
  additionalCondition = true
) {
  const { deviceStore, fetchRefStore } = useContext(Context);
  
  const location = useLocation();
  const { categoryIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();
  
  const prevUsedFilters = useRef(deviceStore.usedFilters);
  const prevLocationPathname = useRef(location.pathname);

  const hasChangedURL = prevLocationPathname.current !== location.pathname;

  // it works if you make these steps right (type is the example of outer param 
  // (or inner if it doesn't work even without the method below)):

  // function disaLox(..., propsType) {
  //   console.log("disa indeed lox", propsType);
  // }

  // const disaLoxRemastered = useCallback(() => disaLox(..., type), [type])

  // useEffect(() => disaLoxRemastered(), [location]);

  async function fetchingCallback(location, categoryIdSlug, hasChangedURL, type) {
    const isInitialFetch = !deviceStore.devices.length || !_.isEqual(deviceStore.usedFilters, prevUsedFilters.current) || hasChangedURL;
    
    try {
      if (isInitialFetch) {
        isGlobalLoadingSetter(true);
      }
      
      const [minQueryPrice, maxQueryPrice] =
        URLActions.getParamValue("price")?.split("-").map(price => +price) || [];
  
      const start = deviceStore.limit * (deviceStore.page - 1);
      const limit = deviceStore.limit * deviceStore.pagesToFetch;
      
      const toFilterByOneSeller = type === "seller" && seller;
  
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
  
      const preparedSearchQuery = typeof searchQuery === "string" ? getPreparedForMockServerStr(searchQuery) : searchQuery;
      if (type === "search") fetchStringQueryParams += `&name_like=${preparedSearchQuery}`.replaceAll(`"`, "");
      if (categoryIdParam && type !== "category") fetchStringQueryParams += `&categoryId=${categoryIdParam}`.replaceAll(`"`, "");

      let { devices, spellCheckedSearchQuery } = await getDevicesBySearchQuery(
        fetchStringQueryParams, type === "search", setIsFoundDevicesByQuery, setSpellCheckedQuery, navigate
      );

      if (type === "category") {
        const categoryId = categoryIdSlug?.split("--")[0];
        let descendantCategories = getDescendantCategories(categoryId, deviceStore.categories);
        descendantCategories.push(categoryId);
  
        devices = devices.filter(dev => descendantCategories.includes(dev.categoryId));
      }

      if (isInitialFetch) {
        // something causes the global loading to not appear
        // and setting it here alongstead with the of the action
        // at the start of the try ... catch block fixes the problem
        // (idk why)
        isGlobalLoadingSetter(true);
      }
  
      const stocks = await getStocks();
      const sales = await getSales();
      const saleTypeNames = await getSaleTypeNames();
  
      const sellers = await getSellers();
      const brands = deviceStore.brands;

      if (toFilterByOneSeller) {
        devices = filterDevicesByOneSeller(devices, sellers, seller);
      }
  
      // we clone devices array deeply to prevent changing of a device combos
      // (it's important for stock filter because it doesn't change on using it)
      let filteredDevices = _.cloneDeep(devices);
      let pageFilteredDevices = [];
  
      const filterBySpecialFiltersResult = filterDevicesBySpecialFilters(
        filteredDevices, stocks, sellers, brands, sales, saleTypeNames,
        minQueryPrice, maxQueryPrice, deviceStore.usedFilters
      );

      const { minPrice, maxPrice, isSpecialFilters } = filterBySpecialFiltersResult;
      filteredDevices = filterBySpecialFiltersResult.devices;

      const attributes = await getDeviceStructuredAttributes(isSpecialFilters, filteredDevices);

      const filtersWithoutSpecial = getUsedFiltersWithoutSpecial(deviceStore.usedFilters);
      if (Object.keys(filtersWithoutSpecial).length) {
        // if we have used filters, do filtration
        filteredDevices = filteredDevices.filter(
          dev => filterDevicesWithCommonFilters(dev, attributes, filtersWithoutSpecial)
        );
      }
  
      let filters = getDeviceFiltersObj(
        devices, stocks, sellers, brands, sales, 
        saleTypeNames, minQueryPrice, maxQueryPrice, attributes, 
        deviceStore.usedFilters, !toFilterByOneSeller
      );
  
      if (splittedSortFilter?.[1] === "price") {
        sortDevicesByPrice(filteredDevices, stocks, sales, saleTypeNames, true, splittedSortFilter[0] === "desc");
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

      fetchRefStore.setLastDevicesFetchCategoryId(type === "category" ? categoryIdSlug?.split("--")?.[0] || null : null);
      fetchRefStore.setLastDevicesFetchUsedFilters(deviceStore.usedFilters || null);
      fetchRefStore.setLastDevicesFetchSortFilter(sortFilter || null);
      fetchRefStore.setLastDevicesFetchPageFiltersObj({ page: deviceStore.page, pagesToFetch: deviceStore.pagesToFetch } || null);
      fetchRefStore.setLastDevicesFetchSearch(type === "search" ? spellCheckedSearchQuery || preparedSearchQuery || null : null);
      fetchRefStore.setLastDevicesFetchSellerId(type === "seller" ? seller?.id || null : null);
  
      prevUsedFilters.current = deviceStore.usedFilters;
      prevLocationPathname.current = location.pathname;
    } finally {
      if (isInitialFetch) {
        isGlobalLoadingSetter(false);
      }
    }
    
  }

  const [fetching, isLoading, error] = useFetching((location, categoryIdSlug, hasChangedURL) => fetchingCallback(location, categoryIdSlug, hasChangedURL, originalType), 0, null, [originalType]);

  useEffect(() => {
    if (additionalCondition) fetching(location, categoryIdSlug, hasChangedURL);
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
    additionalCondition
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;