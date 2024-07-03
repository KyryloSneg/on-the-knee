import { ONE_DEVICE_QUESTIONS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getOneDeviceQuestions(id) {
  const { data } = await $mockApi.get(ONE_DEVICE_QUESTIONS_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}

export async function createDeviceQuestion(formData) {
  const { data } = await $mockApi.post("/device-questions", formData);
  return data;
}

export async function createDeviceAnswer(formData) {
  const { data } = await $mockApi.post("/device-answers", formData);
  return data;
}