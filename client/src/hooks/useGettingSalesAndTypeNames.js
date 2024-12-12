import { Context } from "Context";

const { useEffect, useContext } = require("react");
const { getSales, getSaleTypeNames } = require("../http/SalesAPI");
const { default: useFetching } = require("./useFetching");

function useGettingSalesAndTypeNames(additionalCondition = true) {
  const { deviceStore } = useContext(Context);

  async function fetchingCallback() {
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();
    
    deviceStore.setSales(sales);
    deviceStore.setSaleTypeNames(saleTypeNames);
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    if (additionalCondition) fetching();
  }, [fetching, additionalCondition]);

  return [fetching, isLoading, error];
}

export default useGettingSalesAndTypeNames;