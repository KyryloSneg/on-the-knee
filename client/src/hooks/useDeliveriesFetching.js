const { useEffect, useContext } = require("react");
const { Context } = require("../Context");
const { default: useFetching } = require("./useFetching");
const { getDeliveries } = require("../http/DeliveriesAPI");

export default function useDeliveriesFetching() {
  const { app } = useContext(Context);
  
  async function fetchingCallback() {
    app.setIsToShowAsideDeliveryPrice(false);
    const fetchedDeliveries = await getDeliveries(app.userLocation?.id);
    app.setDeliveries(fetchedDeliveries);
  }

  const [fetching] = useFetching(fetchingCallback);
  
  useEffect(() => {
    fetching();
    // refetching our deliveries on changing user location
  }, [fetching, app.userLocation]);
}