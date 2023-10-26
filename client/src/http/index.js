import axios from "axios"

export const $api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
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
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});