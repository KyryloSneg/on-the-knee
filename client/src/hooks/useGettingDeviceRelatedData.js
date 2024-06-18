import { useEffect } from "react";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { getStocks } from "../http/StocksAPI";

function useGettingDeviceRelatedData(setSales, setSaleTypeNames, setStocks, results = null) {

  async function fetchingFunc() {
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();
    const stocks = await getStocks();

    setSales(sales);
    setSaleTypeNames(saleTypeNames);
    setStocks(stocks);
  }

  const [fetching] = useFetching(fetchingFunc);

  useEffect(() => {
    if (results?.device.length || results === null) fetching();
  }, [setSales, setSaleTypeNames, results, fetching]);

}

export default useGettingDeviceRelatedData;