import axios from "axios";
import { $api } from "./index";
import { getUserIp } from "./UserLocationAPI";

// name, surname, password, email, phoneNumber, ip
export async function registerUser(userData) {
  const { data } = await $api.post("/registration", userData);
  return data;
}

// address (email / phone number), password, ip
export async function login(userData) {
  const { data } = await $api.post(`/login`, userData);
  return data;
}

export async function isAuthFetch() {
  const ip = await getUserIp();

  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/refresh/${ip}`, { withCredentials: true });
  return data;
}

export async function getUser(id, isDto) {
  const { data } = await $api.get(`/users/${id}?isDto=${isDto}`);
  return data;
}