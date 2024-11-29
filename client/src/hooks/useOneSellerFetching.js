import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSeller } from "../http/SellersAPI";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";

function useOneSellerFetching(
  id, setSeller, additionalCondition = true, isToUseGlobalLoading = true, isTopDevicePageFetch = false
) {
  const { app, fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  async function fetchingCallback(propsId) {
    const fetchedSeller = await getOneSeller(propsId);
    setSeller(fetchedSeller);

    if (isTopDevicePageFetch) fetchRefStore.setLastDevicePageFetchSeller(fetchedSeller);
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useEffect(() => {
    if (isToUseGlobalLoading) isGlobalLoadingSetter(isLoading);
  }, [app, isLoading, isGlobalLoadingSetter, isToUseGlobalLoading]);

  useEffect(() => {
    return () => { if (isToUseGlobalLoading) isGlobalLoadingSetter(false); };
  }, [app, isGlobalLoadingSetter, isToUseGlobalLoading]);

  useEffect(() => {
    if ((id !== null && id !== undefined) && additionalCondition) fetching();
  }, [id, fetching, additionalCondition]);

  return [fetching, isLoading, error];
}

export default useOneSellerFetching;