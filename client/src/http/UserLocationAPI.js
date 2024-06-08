import axios from "axios";

export async function getUserIp() {
  const { data } = await axios.get("https://api64.ipify.org?format=json");
  const ip = data.ip;

  return ip;
}

export async function getUserLocation() {
  const ip = await getUserIp();
  const { data: locationObj } = await axios.get(`http://ip-api.com/json/${ip}`);

  return locationObj;
}