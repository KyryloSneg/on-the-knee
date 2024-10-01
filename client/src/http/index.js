import axios from "axios"
import LocalStorageActions from "../utils/LocalStorageActions";

export const $api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const $mockApi = axios.create({
  baseURL: process.env.REACT_APP_MOCK_API_URL
});

export const $authApi = axios.create({
  // hooking cookie to a request
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL
});

$authApi.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${LocalStorageActions.getItem("token", true, false)}`;
  return config;
});