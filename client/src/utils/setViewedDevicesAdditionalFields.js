import { getDevice, getOneDeviceCombinations } from "../http/DeviceApi";
import { deleteViewedDevice } from "http/ViewedDevicesAPI";
import deleteFetchWithTryCatch from "./deleteFetchWithTryCatch";

// mutating data array items
// if the device or the combo of a viewed device don't exist, delete viewed dev
// (so declare variable that is passed to this fn as "data" arg with "let" keyword)
export default async function setViewedDevicesAdditionalFields(data, isAuth) {
  if (Array.isArray(data)) {
    const initialDataLength = data.length;

    // contains corresponding ids
    let viewedDevsToDelete = [];
    for (let viewedDevice of data) {
      try {
        // if we have already setted the fields, do it once again to be sure that
        // ones aren't outdated
        viewedDevice.device = await getDevice(viewedDevice.deviceId);
        viewedDevice.device["device-combinations"] = await getOneDeviceCombinations(viewedDevice.device.id);
      } catch (e) {
        if (e.response.status === 404) {
          viewedDevsToDelete.push(viewedDevice.id);

          if (isAuth) {
            // i don't think that we must put awaits before async fns here
            deleteFetchWithTryCatch(async () => deleteViewedDevice(viewedDevice.id));
          };
        };
      };
    };

    // clear data from the deleted viewed devices (and localStorage if !isAuth and data has changed)
    if (viewedDevsToDelete.length) data = data.filter(viewedDev => !viewedDevsToDelete.includes(viewedDev.id));
    if (!isAuth && data.length !== initialDataLength) {
      localStorage.setItem("viewedDevices", JSON.stringify(data));
    }
  };

  return data;
};