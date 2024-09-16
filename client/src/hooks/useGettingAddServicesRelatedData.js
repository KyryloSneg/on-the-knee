import { useEffect } from "react";
import useFetching from "./useFetching";
import { getDevice } from "../http/DeviceApi";
import _ from "lodash";
import { getAdditionalService, getOneDevAdditionalServiceDevices } from "../http/AdditionalServicesAPI";

function useGettingAddServicesRelatedData(device, setAdditionalServicesObj, isToFetch = true) {

  async function fetchingFunc(dev) {
    let deviceClone = _.cloneDeep(dev);
    let additionalServiceDevices;
    if (deviceClone["additional-service-devices"]?.length) {
      additionalServiceDevices = deviceClone["additional-service-devices"];
    } else {
      additionalServiceDevices = await getOneDevAdditionalServiceDevices(device?.id);
    }
    
    // extending additional service devices with deeper and deeper values
    // (doing it in deeply cloned device's field)

    Promise.all(additionalServiceDevices.map(async serviceDev => {
      let service = await getAdditionalService(serviceDev["additional-serviceId"])
      const serviceDevice = await getDevice(service.deviceId);
      service["device"] = serviceDevice;

      serviceDev["additional-service"] = service;
      return serviceDev;
    })).then(() => {
      // setting the value only after the loop is done
      setAdditionalServicesObj(additionalServiceDevices);
    });
  }

  const [fetching] = useFetching(fetchingFunc);

  useEffect(() => {
    if (!!device && isToFetch) fetching(device);
  }, [device, fetching, isToFetch]);

}

export default useGettingAddServicesRelatedData;