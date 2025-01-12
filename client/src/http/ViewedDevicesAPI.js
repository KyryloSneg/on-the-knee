import { v4 } from "uuid";
import setViewedDevicesAdditionalFields from "../utils/setViewedDevicesAdditionalFields";

const { $mockApi } = require(".");

export async function getOneViewedDevicesList(userId) {
  const { data } = await $mockApi.get(`/viewed-devices-lists?userId=${userId}`);
  return Array.isArray(data) ? data?.[0] : data;
}

// order: "desc" | "asc"
export async function getOneViewedDevicesListDevs(viewedDevicesListId, options = { isToSortByDate: true, order: "desc" } ) {
  let { data } = await $mockApi.get(`/viewed-devices?viewed-devices-listId=${viewedDevicesListId}`);

  if (Array.isArray(data)) {
    if (options.isToSortByDate) {
      if (options.order === "desc") {
        data.sort((a, b) => b.date.localeCompare(a.date));
      } else {
        data.sort((a, b) => a.date.localeCompare(b.date));
      }
    }

    await setViewedDevicesAdditionalFields(data);
  }
  
  return data;
}

export async function createViewedDevicesList(userId) {
  const viewedDevicesList = {
    "id": v4(),
    "userId": userId,
  };

  const { data } = await $mockApi.post("/viewed-devices-lists", viewedDevicesList);
  return data;
}

export async function createViewedDevice(viewedDevice) {
  const { data } = await $mockApi.post("/viewed-devices", viewedDevice);
  return data;
}

export async function deleteViewedDevice(id) {
  const { data } = await $mockApi.delete("/viewed-devices/" + id);
  return data;
}