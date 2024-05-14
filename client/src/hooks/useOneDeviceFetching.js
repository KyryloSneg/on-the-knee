import { useEffect } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";

function useOneDeviceFetching(id, setDevice) {
  async function fetchingCallback() {
    const fetchedDevice = await getDevice(id);
    setDevice(fetchedDevice);
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useOneDeviceFetching;