import { $api, $authApi } from "./index";

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

export async function logout() {
  const { data } = await $api.post(`/logout`);
  return data;
}

export async function sendShortTermActivationEmail() {
  const { data } = await $authApi.post("/send-short-term-activation-email");
  return data;
}

export async function isAuthFetch() {
  const { data } = await $api.get("/refresh");
  return data;
}

export async function changeUserNameSurname(name, surname) {
  const { data } = await $authApi.patch("/change-name-surname", { name, surname });
  return data;
}

export async function changeUserPhoneNumber(phoneNumber) {
  const { data } = await $authApi.patch("/change-phone-number", { phoneNumber });
  return data;
}

export async function changeUserEmail(email) {
  const { data } = await $authApi.patch("/change-email", { email });
  return data;
}

export async function changeUserPassword(currentPassword, newPassword) {
  const { data } = await $authApi.patch("/change-password", { currentPassword, newPassword });
  return data;
}

export async function getUserEmailsToConfirm() {
  const { data } = await $authApi.get("/user-emails-to-confirm");
  return data;
}

export async function getUser(id, isDto) {
  const { data } = await $api.get(`/users/${id}?isDto=${isDto}`);
  return data;
}