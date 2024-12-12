import { getOneQuestionDislikes, getOneQuestionLikes } from "../http/DeviceQuestionsAPI";
import { getOneFeedbackDislikes, getOneFeedbackLikes } from "../http/FeedbacksAPI";
import useFetching from "./useFetching";

function useFetchingDeviceCommentRates(commentId, setLikes, setDislikes, type) {
  async function fetchingLikesCb() {
    let likes;
    if (type === "deviceFeedbacks") {
      likes = await getOneFeedbackLikes(commentId);
    } else if (type === "deviceQuestions") {
      likes = await getOneQuestionLikes(commentId);
    }

    setLikes(likes);
    return likes;
  }

  async function fetchingDislikesCb() {
    let dislikes;
    if (type === "deviceFeedbacks") {
      dislikes = await getOneFeedbackDislikes(commentId);
    } else if (type === "deviceQuestions") {
      dislikes = await getOneQuestionDislikes(commentId);
    }

    setDislikes(dislikes);
    return dislikes;
  }

  const [fetchingLikes] = useFetching(fetchingLikesCb);
  const [fetchingDislikes] = useFetching(fetchingDislikesCb);

  return { fetchingLikes, fetchingDislikes };
}

export default useFetchingDeviceCommentRates;