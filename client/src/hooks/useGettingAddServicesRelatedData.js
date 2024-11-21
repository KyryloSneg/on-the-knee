import { useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";
import _ from "lodash";
import { getAdditionalService, getOneDevAdditionalServiceDevices } from "../http/AdditionalServicesAPI";

// if not isMultiple, pass device, otherwise pass devices array
function useGettingAddServicesRelatedData(
  device = null, setAdditionalServicesObj, isToFetch = true, 
  isMultiple = false, devices = null, additionalCondition = true
) {
  const prevDevicesRef = useRef(null);

  async function fetchingFunc(dev, devs, isMult) {
    async function getTheDataForADevice(propsDevice) {
      let deviceClone = _.cloneDeep(propsDevice);
      let additionalServiceDevices;
      
      if (deviceClone["additional-service-devices"]?.length) {
        additionalServiceDevices = deviceClone["additional-service-devices"];
      } else {
        additionalServiceDevices = await getOneDevAdditionalServiceDevices(propsDevice?.id);
      }

      // indicating that the device does not have additional services
      if (!additionalServiceDevices) return null;
      
      // extending additional service devices with deeper and deeper values
      // (doing it in deeply cloned device's field)
  
      await Promise.all(additionalServiceDevices.map(async serviceDev => {
        let service = await getAdditionalService(serviceDev["additional-serviceId"])
        const serviceDevice = await getDevice(service.deviceId);
        service["device"] = serviceDevice;
  
        serviceDev["additional-service"] = service;
        return serviceDev;
      }));

      return additionalServiceDevices;
    }

    if (!isMult) {
      const additionalServiceDevices = await getTheDataForADevice(dev);
      setAdditionalServicesObj(additionalServiceDevices);
    } else {
      let addServiceDevicesObjArray = [];

      for (let deviceItem of devs) {
        const addServiceDevices = await getTheDataForADevice(deviceItem);
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