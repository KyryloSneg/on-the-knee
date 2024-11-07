import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";
import { Context } from "../Context";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import { ROOT_ROUTE } from "../utils/consts";

function useOneDeviceFetching(id, setDevice, isToRedirectToMainPageOnFail = false) {
  const { app } = useContext(Context);
  const navigate = useNavigateToEncodedURL();

  async function fetchingCallback(propsId) {
    const fetchedDevice = await getDevice(propsId);
    setDevice(fetchedDevice);
  }

  // updating our propsId on getting other device from different url
  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(id), 0, null, [id]);
  useEffect(() => {
    app.setIsGlobalLoading(isLoading);
  }, [app, isLoading]);

  useEffect(() => {
    return () => app.setIsGlobalLoading(false);
  }, [app]);

  useEffect(() => {
    fetching();
  }, [fetching]);

  useEffect(() => {
    if (isToRedirectToMainPageOnFail && error) navigate(ROOT_ROUTE);
  }, [error, isToRedirectToMainPageOnFail, navigate]);

  return [fetching, isLoading, error];
}

export default useOneDeviceFetching;