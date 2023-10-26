import { DEVICE_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getDevices(stringQueryParams = "") {
  const res = await $mockApi.get(`${DEVICE_API_URL}&${stringQueryParams}`);
  const totalCount = res.headers["x-total-count"];
  return { devices: res.data, totalCount: totalCount };
}