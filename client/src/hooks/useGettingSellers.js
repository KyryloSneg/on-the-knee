import { useEffect } from "react";
import { getSellers } from "../http/SellersAPI";
import useFetching from "./useFetching";

function useGettingSellers(setSellers) {
  async function fetchingCallback() {
    const sellers = await getSellers();
    setSellers(sellers);
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useGettingSellers;