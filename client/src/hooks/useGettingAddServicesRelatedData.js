import { useEffect } from "react";
import useFetching from "./useFetching";
import { getAdditionalService } from "../http/AdditionalServicesAPI";
import { getDevice } from "../http/DeviceApi";
import _ from "lodash";

function useGettingAddServicesRelatedData(device, setAdditionalServicesObj) {

  async function fetchingFunc(dev) {
    let deviceClone = _.cloneDeep(dev);
    let additionalServiceDevices = deviceClone["additional-service-devices"];

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
    if (!!device) fetching(device);
  }, [device, fetching]);

}

export default useGettingAddServicesRelatedData;