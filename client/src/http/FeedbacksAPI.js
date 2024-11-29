import { ONE_DEVICE_FEEDBACKS_API_URL, ONE_SELLER_FEEDBACKS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";
import { getOneSeller } from "./SellersAPI";

// fetchStringQueryParams starts with an ampersand "&"
export async function getOneDeviceFeedbacks(id, fetchStringQueryParams = "", isToSetSellers = true) {
  const { data } = await $mockApi.get(ONE_DEVICE_FEEDBACKS_API_URL.replace("ID_TO_REPLACE", id) + fetchStringQueryParams);

  try {
    if (data?.length && isToSetSellers) {
      const seller = await getOneSeller(data[0]?.device?.sellerId);
      
      for (let feedback of data) {
        feedback.seller = seller;
      }
    }
  } catch (e) {
    console.log(e.message);
  }

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

export async function createSellerFeedback(formData) {
  const { data } = await $mockApi.post("/seller-feedbacks", formData);
  return data;
}

export async function deleteDeviceFeedback(id) {
  const { data } = await $mockApi.delete("/device-feedbacks/" + id);
  return data;
}

export async function deleteDeviceFeedbackReply(id) {
  const { data } = await $mockApi.delete("/device-feedback-replies/" + id);
  return data;
}

export async function deleteSellerFeedback(id) {
  const { data } = await $mockApi.delete("/seller-feedbacks/" + id);
  return data;
}

export async function patchDeviceFeedback(id, contentToReplaceWith) {
  const { data } = await $mockApi.patch("/device-feedbacks/" + id, contentToReplaceWith);
  return data;
}

export async function patchDeviceFeedbackReply(id, contentToReplaceWith) {
  const { data } = await $mockApi.patch("/device-feedback-replies/" + id, contentToReplaceWith);
  return data;
}

export async function patchSellerFeedback(id, contentToReplaceWith) {
  // sometimes it throws 404, so change headers a bit to prevent this
  const { data } = await $mockApi.patch("/seller-feedbacks/" + id, contentToReplaceWith, {
    headers: {
      "Accept": "*/*, application/json, text/plain",
    }
  });

  return data;
}