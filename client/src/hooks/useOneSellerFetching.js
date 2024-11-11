import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSeller } from "../http/SellersAPI";

function useOneSellerFetching(id, setSeller, additionalCondition = true, isToUseGlobalLoading = true) {
  const { app } = useContext(Context);

  async function fetchingCallback(propsId) {
    const fetchedSeller = await getOneSeller(propsId);
    setSeller(fetchedSeller);
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useEffect(() => {
    if (isToUseGlobalLoading) app.setIsGlobalLoading(isLoading);
  }, [app, isLoading, isToUseGlobalLoading]);

  useEffect(() => {
    return () => { if (isToUseGlobalLoading) app.setIsGlobalLoading(false); };
  }, [app, isToUseGlobalLoading]);

  useEffect(() => {
    if (additionalCondition) fetching();
  }, [fetching, additionalCondition]);

  return [fetching, isLoading, error];
}

export default useOneSellerFetching;