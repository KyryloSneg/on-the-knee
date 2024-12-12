import { deleteDeviceFeedback, deleteDeviceFeedbackReply, deleteSellerFeedback, getOneDeviceFeedbacks, getOneSellerFeedbacks } from "http/FeedbacksAPI";
import deleteFetchWithTryCatch from "./deleteFetchWithTryCatch";
import { deleteDeviceAnswer, deleteDeviceQuestion } from "http/DeviceQuestionsAPI";
import updateDeviceRating from "./updateDeviceRating";
import updateSellerRating from "./updateSellerRating";

/**
  * function to use in delete comment and delete reply functions of corresponding components
  * 
  * @param {string | number} id - comment id
  * @param {string | number} deviceOrSellerId - comment's device or seller (depends on the commentType)
  * @param {"deviceFeedbacks" | "deviceQuestions" | "sellerFeedbacks"} commentType - type of commentsListItem
  * @param {"comment" | "reply"} logicType - type of the function's logic
  * @param {function()} deviceFeedbacksFetching
  * @param {function()} deviceQuestionsFetching
  * @param {function()} sellerFeedbacksFetching
  * @param {boolean} areUserFeedbacks - is deleting a comment from the user page
  */
export default async function deleteCommentLogic(
  id, deviceOrSellerId, commentType, logicType, 
  deviceFeedbacksFetching, deviceQuestionsFetching, sellerFeedbacksFetching,
  areUserFeedbacks
) {
  async function deviceDeleteFetch(onCommentType, onReplyType) {
    if (logicType === "comment") {
      await onCommentType(id);
    } else if (logicType === "reply") {
      await onReplyType(id);
    }
  }

  if (commentType === "deviceFeedbacks") {
    await deleteFetchWithTryCatch(async () => await deviceDeleteFetch(deleteDeviceFeedback, deleteDeviceFeedbackReply));
    const fetchingResult = await deviceFeedbacksFetching();
    
    let updatedDeviceFeedbacks;  
    if (areUserFeedbacks) {
      updatedDeviceFeedbacks = await getOneDeviceFeedbacks(deviceOrSellerId, "", false);
    } else {
      updatedDeviceFeedbacks = fetchingResult.feedbacks;
    }

    await updateDeviceRating(updatedDeviceFeedbacks, deviceOrSellerId);
  } else if (commentType === "deviceQuestions") {
    await deleteFetchWithTryCatch(async () => await deviceDeleteFetch(deleteDeviceQuestion, deleteDeviceAnswer));
    await deviceQuestionsFetching();
  } else if (commentType === "sellerFeedbacks") {
    await deleteFetchWithTryCatch(async () => await deleteSellerFeedback(id));
    const updatedSellerFeedbacksFromFetch = await sellerFeedbacksFetching();
    
    let updatedSellerFeedbacks;  
    if (areUserFeedbacks) {
      updatedSellerFeedbacks = await getOneSellerFeedbacks(deviceOrSellerId);
    } else {
      updatedSellerFeedbacks = updatedSellerFeedbacksFromFetch;
    }

    await updateSellerRating(updatedSellerFeedbacks, deviceOrSellerId);
  }
}