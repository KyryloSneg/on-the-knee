import { getDevice, getOneDeviceCombinations } from "http/DeviceApi";

export default async function setOneViewedDevAdditionalFields(viewedDev) {
  viewedDev.device = await getDevice(viewedDev.deviceId);
  viewedDev.device["device-combinations"] = await getOneDeviceCombinations(viewedDev.device.id);
}