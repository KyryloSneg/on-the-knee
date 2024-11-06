import { getDevice, getOneDeviceCombinations } from "../http/DeviceApi";

// mutating data array items
export default async function setViewedDevicesAdditionalFields(data) {
  if (Array.isArray(data)) {
    for (let viewedDevice of data) {
      viewedDevice.device = await getDevice(viewedDevice.deviceId);
      viewedDevice.device["device-combinations"] = await getOneDeviceCombinations(viewedDevice.device.id);
    };
  };

  return data;
};