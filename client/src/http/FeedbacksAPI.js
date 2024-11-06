import { ONE_DEVICE_FEEDBACKS_API_URL, ONE_SELLER_FEEDBACKS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";

// fetchStringQueryParams starts with an ampersand "&"
export async function getOneDeviceFeedbacks(id, fetchStringQueryParams = "") {
  const { data } = await $mockApi.get(ONE_DEVICE_FEEDBACKS_API_URL.replace("ID_TO_REPLACE", id) + fetchStringQueryParams);
  return data;
}

export async function getOneSellerFeedbacks(id, fetchStringQueryParams = "") {
  const { data } = await $mockApi.get(ONE_SELLER_FEEDBACKS_API_URL.replace("ID_TO_REPLACE", id) + fetchStringQueryParams);
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

export async function createDeviceFeedback(formData) {
  const { data } = await $mockApi.post("/device-feedbacks", formData);
  return data;
}

export async function createDeviceFeedbackReply(formData) {
  const { data } = await $mockApi.post("/device-feedback-replies", formData);
  return data;
}