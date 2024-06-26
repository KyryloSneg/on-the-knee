import { getOneFeedbackDislikes, getOneFeedbackLikes } from "../http/FeedbacksAPI";
import useFetching from "./useFetching";

function useFetchingDeviceFeedbackRates(feedbackId, setLikes, setDislikes) {
  async function fetchingLikesCb() {
    const likes = await getOneFeedbackLikes(feedbackId);
    setLikes(likes);
  }

  async function fetchingDislikesCb() {
    const dislikes = await getOneFeedbackDislikes(feedbackId);
    setDislikes(dislikes);
  }

  const fetchingLikes = useFetching(fetchingLikesCb)[0];
  const fetchingDislikes = useFetching(fetchingDislikesCb)[0];

  return { fetchingLikes, fetchingDislikes }; 
}

export default useFetchingDeviceFeedbackRates;