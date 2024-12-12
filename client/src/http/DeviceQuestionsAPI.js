import { ONE_DEVICE_QUESTIONS_API_URL } from "../utils/consts";
import { $mockApi } from "./index";
import { getOneSeller } from "./SellersAPI";

// fetchStringQueryParams starts with an ampersand "&"
export async function getOneDeviceQuestions(id, fetchStringQueryParams = "") {
  const { data } = await $mockApi.get(ONE_DEVICE_QUESTIONS_API_URL.replace("ID_TO_REPLACE", id) + fetchStringQueryParams);
  
  try {
    const seller = await getOneSeller(data?.[0]?.device?.sellerId);
    
    for (let question of data) {
      question.seller = seller;
    }
  } catch (e) {
    console.log(e.message);
  }

  return data;
}

export async function createDeviceQuestion(formData) {
  const { data } = await $mockApi.post("/device-questions", formData);
  return data;
}

export async function getOneQuestionLikes(deviceQuestionId) {
  const { data } = await $mockApi.get(`/device-question-likes?device-questionId=${deviceQuestionId}`);
  return data;
}

export async function getOneQuestionDislikes(deviceQuestionId) {
  const { data } = await $mockApi.get(`/device-question-dislikes?device-questionId=${deviceQuestionId}`);
  return data;
}

export async function createQuestionLike(likeObject) {
  await $mockApi.post("/device-question-likes", likeObject);
}

export async function createQuestionDislike(dislikeObject) {
  await $mockApi.post("/device-question-dislikes", dislikeObject);
}

export async function removeQuestionLike(id) {
  await $mockApi.delete("/device-question-likes/" + id);
}

export async function removeQuestionDislike(id) {
  await $mockApi.delete("/device-question-dislikes/" + id);
}

export async function createDeviceAnswer(formData) {
  const { data } = await $mockApi.post("/device-answers", formData);
  return data;
}

export async function deleteDeviceQuestion(id) {
  const { data } = await $mockApi.delete("/device-questions/" + id);
  return data;
}

export async function deleteDeviceAnswer(id) {
  const { data } = await $mockApi.delete("/device-answers/" + id);
  return data;
}

export async function patchDeviceQuestion(id, contentToReplaceWith) {
  const { data } = await $mockApi.patch("/device-questions/" + id, contentToReplaceWith);
  return data;
}

export async function patchDeviceAnswer(id, contentToReplaceWith) {
  const { data } = await $mockApi.patch("/device-answers/" + id, contentToReplaceWith);
  return data;
}