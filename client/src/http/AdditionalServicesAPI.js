import { ONE_ADDITIONAL_SERVICES_API_URL, ONE_DEV_ADDITIONAL_SERVICE_DEVICES_API_URL } from "../utils/consts";
const { $mockApi } = require(".");

export async function getAdditionalService(id) {
  const { data } = await $mockApi.get(ONE_ADDITIONAL_SERVICES_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}

export async function getOneDevAdditionalServiceDevices(deviceId) {
  const { data } = await $mockApi.get(ONE_DEV_ADDITIONAL_SERVICE_DEVICES_API_URL.replace("ID_TO_REPLACE", deviceId));
  return data;
}

export async function deleteAdditionalServiceDevice(id) {
  const { data } = await $mockApi.delete("/additional-service-devices/" + id);
  return data;
}