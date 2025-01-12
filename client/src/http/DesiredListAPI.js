import { v4 } from "uuid";
import { getDevice, getDeviceCombination, getOneDeviceCombinations } from "./DeviceApi";

const { $mockApi } = require(".");

export async function getOneDesiredList(userId) {
  const { data } = await $mockApi.get(`/desired-lists?userId=${userId}`);
  return Array.isArray(data) ? data?.[0] : data;
}

export async function getOneDesiredListDevices(desiredListId) {
  const { data } = await $mockApi.get(`/desired-list-devices?desired-listId=${desiredListId}`);

  if (Array.isArray(data)) {
    for (let listDevice of data) {
      listDevice.device = await getDevice(listDevice.deviceId);
      listDevice.device["device-combinations"] = await getOneDeviceCombinations(listDevice.device.id);

      listDevice["device-combinations"] = await getDeviceCombination(listDevice["device-combinationId"]);
    }
  }
  
  return data;
}

export async function createDesiredList(userId) {
  const desiredList = {
    "id": v4(),
    "userId": userId,
  };

  const { data } = await $mockApi.post("/desired-lists", desiredList);
  return data;
}

export async function createDesiredListDevice(desiredListDevice) {
  const { data } = await $mockApi.post("/desired-list-devices", desiredListDevice);
  return data;
}

export async function deleteDesiredListDevice(id) {
  const { data } = await $mockApi.delete("/desired-list-devices/" + id);
  return data;
}