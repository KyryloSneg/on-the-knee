import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import _ from "lodash";
import { Context } from "Context";
import getAddServicesDataOfDevice from "utils/getAddServicesDataOfDevice";

// if not isMultiple, pass device, otherwise pass devices array
function useGettingAddServicesRelatedData(
  device = null, setAdditionalServicesObj, isToFetch = true, 
  isMultiple = false, devices = null, additionalCondition = true,
  isDevicePageFetch = false
) {
  const { fetchRefStore } = useContext(Context);
  const prevDevicesRef = useRef(null);

  async function fetchingFunc(dev, devs, isMult) {
    if (!isMult) {
      const additionalServiceDevices = await getAddServicesDataOfDevice(dev);
      setAdditionalServicesObj(additionalServiceDevices);

      // in the device page fetch, we can only get here
      if (isDevicePageFetch) {
        if (fetchRefStore.lastDevicesFetchAddServicesObj?.deviceId !== dev.id) {
          fetchRefStore.setLastDevicesFetchAddServicesObj({
            deviceId: dev.id,
            content: additionalServiceDevices
          });
        }
      }
    } else {
      let addServiceDevicesObjArray = [];

      for (let deviceItem of devs) {
        const addServiceDevices = await getAddServicesDataOfDevice(deviceItem);
        addServiceDevicesObjArray.push(addServiceDevices);
      }

      setAdditionalServicesObj(addServiceDevicesObjArray);
    }
  }

  const [fetching] = useFetching(fetchingFunc);

  useEffect(() => {
    if (
      (!!device || devices) && isToFetch && (devices ? !_.isEqual(devices, prevDevicesRef.current) : true)
      && additionalCondition
    ) {
      fetching(device, devices, isMultiple);
    }
  }, [device, devices, isMultiple, fetching, isToFetch, additionalCondition]);

  useEffect(() => {
    prevDevicesRef.current = devices;
  }, [devices]);

}

export default useGettingAddServicesRelatedData;