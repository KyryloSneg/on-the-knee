import { deleteAdditionalServiceDevice, getAdditionalService, getOneDevAdditionalServiceDevices } from "http/AdditionalServicesAPI";
import { getDevice } from "http/DeviceApi";
import _ from "lodash";
import deleteFetchWithTryCatch from "./deleteFetchWithTryCatch";

export default async function getAddServicesDataOfDevice(propsDevice) {
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
    let service;

    // delete this addServiceDev if its addService does not exist
    try {
      service = await getAdditionalService(serviceDev["additional-serviceId"]);
    } catch (e) {
      if (e.response.status === 404) {
        await deleteFetchWithTryCatch(async () => await deleteAdditionalServiceDevice(serviceDev.id));
      } else throw e;
    }
    
    if (service) {
      const serviceDevice = await getDevice(service.deviceId);
      service["device"] = serviceDevice;
  
      serviceDev["additional-service"] = service;
      return serviceDev;
    } else return null;
  }));

  // clear them up from possible null (deleted while fetching additional info) values
  additionalServiceDevices = additionalServiceDevices.filter(addServiceDev => !!addServiceDev);
  return additionalServiceDevices;
}