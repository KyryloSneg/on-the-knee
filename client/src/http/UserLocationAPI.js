import axios from "axios";

export async function getUserIp() {
  const { data } = await axios.get("https://api64.ipify.org?format=json");
  const ip = data.ip;

  return ip;
}

export async function getUserLocation() {
  const ip = await getUserIp();
  const { data } = await axios.get(
    // ideally we would use the real server as a proxy between the client and api that requires key to not leak one
    `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_GEOIPIFY_API_KEY}&ipAddress=${ip}`
  );

  return data.location;
}