import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSeller } from "../http/SellersAPI";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";

function useOneSellerFetching(
  id, setSeller, additionalCondition = true, isToUseGlobalLoading = true, isTopDevicePageFetch = false
) {
  const { fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  async function fetchingCallback(propsId) {
    const fetchedSeller = await getOneSeller(propsId);
    setSeller(fetchedSeller);

    if (isTopDevicePageFetch) fetchRefStore.setLastDevicePageFetchSeller(fetchedSeller);
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter, isToUseGlobalLoading);

  useEffect(() => {
    if ((id !== null && id !== undefined) && additionalCondition) fetching();
  }, [id, fetching, additionalCondition]);

  return [fetching, isLoading, error];
}

export default useOneSellerFetching;