const { useEffect } = require("react");
const { getSales, getSaleTypeNames } = require("../http/SalesAPI");
const { default: useFetching } = require("./useFetching");

function useGettingSalesAndTypeNames(deviceStore) {
  async function fetchingCallback() {
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();
    
    deviceStore.setSales(sales);
    deviceStore.setSaleTypeNames(saleTypeNames);
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useGettingSalesAndTypeNames;