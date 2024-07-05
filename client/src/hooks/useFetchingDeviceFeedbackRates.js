import { getOneFeedbackDislikes, getOneFeedbackLikes } from "../http/FeedbacksAPI";
import useFetching from "./useFetching";

function useFetchingDeviceFeedbackRates(feedbackId, setLikes, setDislikes) {
  async function fetchingLikesCb() {
    const likes = await getOneFeedbackLikes(feedbackId);
    setLikes(likes);

    return likes;
  }

  async function fetchingDislikesCb() {
    const dislikes = await getOneFeedbackDislikes(feedbackId);
    setDislikes(dislikes);

    return dislikes;
  }

  const [fetchingLikes, , , , likesFetchResultRef] = useFetching(fetchingLikesCb);
  const [fetchingDislikes, , , , dislikesFetchResultRef] = useFetching(fetchingDislikesCb);

  return { 
    fetchingLikes, 
    fetchingDislikes, 
    likesFetchResultRef, 
    dislikesFetchResultRef 
  };
}

export default useFetchingDeviceFeedbackRates;