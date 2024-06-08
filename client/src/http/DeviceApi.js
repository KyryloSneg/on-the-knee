import { DEVICE_API_URL, ONE_DEVICE_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getDevices(stringQueryParams = "") {
  const res = await $mockApi.get(`${DEVICE_API_URL}&${stringQueryParams}`);
  const totalCount = res.headers["x-total-count"] || res.data.length;
  return { devices: res.data, totalCount: totalCount };
}

export async function getDevice(id, stringQueryParams = "") {
  const res = await $mockApi.get(`${ONE_DEVICE_API_URL.replace("ID_TO_REPLACE", id)}&${stringQueryParams}`);
  return res.data;
}