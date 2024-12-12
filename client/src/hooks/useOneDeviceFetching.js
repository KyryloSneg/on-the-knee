import { useEffect } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import { ROOT_ROUTE } from "../utils/consts";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";

function useOneDeviceFetching(id, setDevice, additionalCondition = true, isToRedirectToMainPageOnFail = false) {
  const navigate = useNavigateToEncodedURL();
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  async function fetchingCallback(propsId) {
    const fetchedDevice = await getDevice(propsId);
    setDevice(fetchedDevice);
  }

  // updating our propsId on getting other device from different url
  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter);

  useEffect(() => {
    if (additionalCondition) fetching();
  }, [fetching, additionalCondition]);

  useEffect(() => {
    if (isToRedirectToMainPageOnFail && error) navigate(ROOT_ROUTE);
  }, [error, isToRedirectToMainPageOnFail, navigate]);

  return [fetching, isLoading, error];
}

export default useOneDeviceFetching;