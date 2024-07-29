import { useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";

function useOneDeviceFeedbacksFetching(deviceId, setFeedbacks = null, setQuestions = null, deviceStore = null) {

  async function fetchingFunc(id) {
    const feedbacks = await getOneDeviceFeedbacks(id);
    const questions = await getOneDeviceQuestions(id);

    if (setFeedbacks) setFeedbacks(feedbacks);
    if (setQuestions) setQuestions(questions);
    
    if (deviceStore) {
      deviceStore.setDeviceFeedbacks(feedbacks);
      deviceStore.setDeviceQuestions(questions);
    }
  }

  const [fetching] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    if (deviceId) fetching();
  }, [setFeedbacks, setQuestions, deviceId, fetching]);

}

export default useOneDeviceFeedbacksFetching;