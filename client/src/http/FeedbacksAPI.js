import { ONE_DEVICE_FEEDBACKS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

export async function getOneDeviceFeedbacks(id) {
  const { data } = await $mockApi.get(ONE_DEVICE_FEEDBACKS_API_URL.replace("ID_TO_REPLACE", id));
  return data;
}

export async function getOneFeedbackLikes(deviceFeedbackId) {
  const { data } = await $mockApi.get(`/device-feedback-likes?device-feedbackId=${deviceFeedbackId}`);
  return data;
}

export async function getOneFeedbackDislikes(deviceFeedbackId) {
  const { data } = await $mockApi.get(`/device-feedback-dislikes?device-feedbackId=${deviceFeedbackId}`);
  return data;
}

export async function createLike(likeObject) {
  await $mockApi.post("/device-feedback-likes", likeObject);
}

export async function createDislike(dislikeObject) {
  await $mockApi.post("/device-feedback-dislikes", dislikeObject);
}

export async function removeLike(id) {
  await $mockApi.delete("/device-feedback-likes/" + id);
}

export async function removeDislike(id) {
  await $mockApi.delete("/device-feedback-dislikes/" + id);
}