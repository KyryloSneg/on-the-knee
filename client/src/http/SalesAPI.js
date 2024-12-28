import { SALE_API_URL, SALES_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getSales() {
  const { data } = await $mockApi.get(SALES_API_URL);
  return data;
}

export async function getOneSale(id) {
  const { data } = await $mockApi.get(SALE_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}

// fetchStringQueryParams must start with "?"
export async function getSaleTypes(fetchStringQueryParams = "") {
  const { data } = await $mockApi.get("/sale-types" + fetchStringQueryParams);
  return data;
}

export async function getSaleTypeNames() {
  const { data } = await $mockApi.get("/sale-type-names");
  return data;
}

export async function getOneDeviceSaleDevices(deviceId, isWithExpandedDevice = false) {
  let url = `/sale-devices?deviceId=${deviceId}&_expand=sale`;
  if (isWithExpandedDevice) {
    url += "&_expand=device";
  }

  const { data } = await $mockApi.get(url);
  // get sale devices only of not ended sales
  let result = [];

  for (let saleDev of data) {
    if (!saleDev.sale.hasEnded) {
      result.push(saleDev);
    }
  }

  return result;
}

export async function getOneSaleSaleDevices(saleId, isWithExpandedDevice = false) {
  let url = `/sale-devices?saleId=${saleId}`;
  if (isWithExpandedDevice) {
    url += "&_expand=device";
  }

  const { data } = await $mockApi.get(url);
  return data;
}