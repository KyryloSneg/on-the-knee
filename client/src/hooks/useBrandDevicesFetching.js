import { useEffect } from "react";
import useFetching from "./useFetching";
import { getDevices } from "../http/DeviceApi";

function useBrandDevicesFetching(brandId) {
  async function fetchingCallback(brandItemId) {
    const { devices } = await getDevices(`brandId=${brandItemId}`);
    return devices;
  }

  // passing argument to change brand's id (if it has changed)
  const [fetching, isLoading, error, fetchResult] = useFetching((brandItemId) => fetchingCallback(brandItemId));

  useEffect(() => {
    if (brandId) fetching(brandId);
  }, [brandId, fetching]);

  return [isLoading, error, fetching, fetchResult];
}

export default useBrandDevicesFetching;