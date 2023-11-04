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
    const { devices, totalCount } = await getDevices(`_start=${start}&_limit=${limit}&${stringQueryParams}`);
    const stocks = await getStocks();
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();

    if (minQueryPrice && maxQueryPrice) {
      for (let dev of devices) {
        const filteredCombos = filterByPriceRange(dev["device-combinations"], minQueryPrice, maxQueryPrice);
        const defaultCombo = filteredCombos.map(combo => combo.default);
        if (!defaultCombo) {
          // setting a default combo (some random combination)
          filteredCombos[0].default = true;
        }
        dev["device-combinations"] = filteredCombos;
      }
    }

    let deviceInfos = [];
    for (let dev of devices) {
      deviceInfos.push(...dev["device-infos"])
    }

    const { minPrice, maxPrice } = await getDeviceMinMaxPrices(stringQueryParams, sales, saleTypeNames);
    deviceStore.setInitialMinPrice(minPrice);
    deviceStore.setInitialMaxPrice(maxPrice);

    deviceStore.setDevices(devices);
    deviceStore.setDeviceInfos(deviceInfos);
    deviceStore.setTotalCount(totalCount);

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
    deviceStore.page, deviceStore.pagesToFetch
  ]);

  return [isLoading, error, fetching];
}

export default useDeviceSectionFetching;