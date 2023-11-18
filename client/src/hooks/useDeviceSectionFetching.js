import _ from "lodash";
import { useEffect, useRef } from "react";
import { getDeviceMinMaxPrices, getDevices } from "../http/DeviceApi";
import { getStocks } from "../http/StocksAPI";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import filterByPriceRange from "../utils/filterByPriceRange";

// query params without pagination ones
function useDeviceSectionFetching(deviceStore, app, stringQueryParams = "", minQueryPrice = null, maxQueryPrice = null) {
  const prevStringQueryParams = useRef(stringQueryParams);
  const isInitialFetch = !deviceStore.devices.length || stringQueryParams !== prevStringQueryParams.current

  async function fetchingCallback() {
    if (isInitialFetch) {
      app.setIsGlobalLoading(true);
    }

    
    const start = deviceStore.limit * (deviceStore.page - 1);
    const limit = deviceStore.limit * deviceStore.pagesToFetch;
    
    const toFilterByPrice = minQueryPrice && maxQueryPrice;
    console.log(toFilterByPrice);
    const deviceFetchPath = toFilterByPrice 
      ? `${stringQueryParams}` 
      : `_start=${start}&_limit=${limit}&${stringQueryParams}`;
    const { devices } = await getDevices(deviceFetchPath);

    const stocks = await getStocks();
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();

    let filteredDevices = [];
    let pageFilteredDevices = [...devices];

    if (toFilterByPrice) {
      filteredDevices = [];

      for (let dev of devices) {
        const filteredCombos = filterByPriceRange(dev["device-combinations"], minQueryPrice, maxQueryPrice);
        // if device has no combos we don't push it to the filteredDevices array
        if (!filteredCombos.length) continue;

        const defaultCombo = filteredCombos.filter(combo => combo.default);
        if (!defaultCombo.length) {
          // setting a default combo (some random combination that left after the filtration)
          filteredCombos[0].default = true;
        }

        dev["device-combinations"] = filteredCombos;
        filteredDevices.push(dev);
      }

      // getting devices for the current page
      pageFilteredDevices = filteredDevices.slice(start, (start + limit));
    }

    let deviceInfos = [];
    for (let dev of filteredDevices) {
      deviceInfos.push(...dev["device-infos"])
    }

    const { minPrice, maxPrice } = await getDeviceMinMaxPrices(stringQueryParams, sales, saleTypeNames);
    if (minPrice !== deviceStore.initialMinPrice) {
      deviceStore.setInitialMinPrice(+(minPrice.toFixed(2)));
    }

    if (maxPrice !== deviceStore.initialMaxPrice) {
      deviceStore.setInitialMaxPrice(+(maxPrice.toFixed(2)));
      console.log(maxPrice);
    }

    deviceStore.setDevices(pageFilteredDevices);
    deviceStore.setDeviceInfos(deviceInfos);
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

    prevStringQueryParams.current = stringQueryParams;
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
    deviceStore.usedFilters
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;