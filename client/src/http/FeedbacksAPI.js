import { ONE_DEVICE_FEEDBACKS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getOneDeviceFeedbacks(id) {
  const { data } = await $mockApi.get(ONE_DEVICE_FEEDBACKS_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}