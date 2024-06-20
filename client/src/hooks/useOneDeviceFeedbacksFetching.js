import { useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";

function useOneDeviceFeedbacksFetching(setFeedbacks, deviceId) {

  async function fetchingFunc(id) {
    const feedbacks = await getOneDeviceFeedbacks(id);
    setFeedbacks(feedbacks);
  }

  const [fetching] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    if (deviceId) fetching();
  }, [setFeedbacks, deviceId, fetching]);

}

export default useOneDeviceFeedbacksFetching;