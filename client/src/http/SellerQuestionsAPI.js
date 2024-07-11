import { $mockApi } from "./index";

export async function createSellerQuestion(formData) {
  const { data } = await $mockApi.post("/seller-questions", formData);
  return data;
}