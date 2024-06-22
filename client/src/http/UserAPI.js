import { $api } from "./index";

export async function getUser(id, isDto) {
  const { data } = await $api.get(`/users/${id}?isDto=${isDto}`);
  return data;
}