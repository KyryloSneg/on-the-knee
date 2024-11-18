import { deleteDeviceFeedback, deleteDeviceFeedbackReply, deleteSellerFeedback } from "http/FeedbacksAPI";
import deleteFetchWithTryCatch from "./deleteFetchWithTryCatch";
import { deleteDeviceAnswer, deleteDeviceQuestion } from "http/DeviceQuestionsAPI";

/**
  * function to use in delete comment and delete reply functions of corresponding components
  * 
  * @param {string | number} id - comment id
  * @param {"deviceFeedbacks" | "deviceQuestions" | "sellerFeedbacks"} commentType - type of commentsListItem
  * @param {"comment" | "reply"} logicType - type of the function's logic
  * @param {function(id)} deviceFeedbacksFetching
  * @param {function(id)} deviceQuestionsFetching
  * @param {function(id)} sellerFeedbacksFetching
  */
export default async function deleteCommentLogic(
  id, commentType, logicType, deviceFeedbacksFetching, deviceQuestionsFetching, sellerFeedbacksFetching
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
    await deviceFeedbacksFetching();
  } else if (commentType === "deviceQuestions") {
    await deleteFetchWithTryCatch(async () => await deviceDeleteFetch(deleteDeviceQuestion, deleteDeviceAnswer));
    await deviceQuestionsFetching();
  } else if (commentType === "sellerFeedbacks") {
    await deleteFetchWithTryCatch(async () => await deleteSellerFeedback(id));
    await sellerFeedbacksFetching();
  }
}