import { SALES_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getSales() {
  const { data } = await $mockApi.get(SALES_API_URL);
  return data;
}

export async function getSaleTypeNames() {
  const { data } = await $mockApi.get("/sale-type-names");
  return data;
}

export async function getOneDeviceSaleDevices(deviceId, isWithExpandedDevice = false) {
  let url = `/sale-devices?deviceId=${deviceId}`;
  if (isWithExpandedDevice) {
    url += "&_expand=devices";
  }

  const { data } = await $mockApi.get(url);
  return data;
}