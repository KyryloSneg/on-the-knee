import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSeller } from "../http/SellersAPI";

function useOneSellerFetching(
  id, setSeller, additionalCondition = true, isToUseGlobalLoading = true, isTopDevicePageFetch = false
) {
  const { app, fetchRefStore } = useContext(Context);

  async function fetchingCallback(propsId) {
    const fetchedSeller = await getOneSeller(propsId);
    setSeller(fetchedSeller);

    if (isTopDevicePageFetch) fetchRefStore.setLastDevicePageFetchSeller(fetchedSeller);
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useEffect(() => {
    if (isToUseGlobalLoading) app.setIsGlobalLoading(isLoading);
  }, [app, isLoading, isToUseGlobalLoading]);

  useEffect(() => {
    return () => { if (isToUseGlobalLoading) app.setIsGlobalLoading(false); };
  }, [app, isToUseGlobalLoading]);

  useEffect(() => {
    if ((id !== null && id !== undefined) && additionalCondition) fetching();
  }, [id, fetching, additionalCondition]);

  return [fetching, isLoading, error];
}

export default useOneSellerFetching;