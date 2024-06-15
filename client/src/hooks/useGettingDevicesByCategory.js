import { useEffect } from "react";
import useFetching from "./useFetching";
import { getDevices } from "../http/DeviceApi";

function useGettingDevicesByCategory(categoryId, setDevices) {

  async function fetchingFunc(categoryItemId) {
    const fetchStringQueryParams = `categoryId=${categoryItemId}`.replaceAll(`"`, "");
    const { devices } = await getDevices(fetchStringQueryParams);

    setDevices(devices);
  }

  const [fetching] = useFetching(() => fetchingFunc(categoryId), 0, null, [categoryId]);

  useEffect(() => {
    if (categoryId) fetching();
  }, [categoryId, setDevices, fetching]);

}

export default useGettingDevicesByCategory;