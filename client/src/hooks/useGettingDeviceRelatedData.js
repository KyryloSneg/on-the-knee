import { useEffect } from "react";
import { getSaleTypeNames, getSales } from "../http/SalesAPI";
import useFetching from "./useFetching";
import { getStocks } from "../http/StocksAPI";

function useGettingDeviceRelatedData(setSales = null, setSaleTypeNames = null, setStocks = null, results = null) {

  async function fetchingFunc() {
    const sales = setSales ? await getSales() : null;
    const saleTypeNames = setSaleTypeNames ? await getSaleTypeNames() : null;
    const stocks = setStocks ? await getStocks() : null;

    if (setSales) setSales(sales);
    if (setSaleTypeNames) setSaleTypeNames(saleTypeNames);
    if (setStocks) setStocks(stocks);
  }

  const [fetching] = useFetching(fetchingFunc);

  useEffect(() => {
    if (results?.device.length || results === null) fetching();
  }, [setSales, setSaleTypeNames, setStocks, results, fetching]);

}

export default useGettingDeviceRelatedData;