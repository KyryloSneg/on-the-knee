import { ONE_ADDITIONAL_SERVICES_API_URL } from "../utils/consts";
const { $mockApi } = require(".");

export async function getAdditionalService(id) {
  const { data } = await $mockApi.get(ONE_ADDITIONAL_SERVICES_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}