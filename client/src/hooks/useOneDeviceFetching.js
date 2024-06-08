import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";
import { Context } from "../Context";

function useOneDeviceFetching(id, setDevice) {
  const { app } = useContext(Context);

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
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useOneDeviceFetching;