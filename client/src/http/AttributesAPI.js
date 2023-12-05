import { ATRIBUTES_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getAttributesInfo() {
  const { data } = await $mockApi.get(ATRIBUTES_API_URL);
  return data;
}