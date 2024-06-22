import { useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";

function useOneDeviceFeedbacksFetching(setFeedbacks, setQuestions, deviceId) {

  async function fetchingFunc(id) {
    const feedbacks = await getOneDeviceFeedbacks(id);
    const questions = await getOneDeviceQuestions(id);

    setQuestions(questions);
    setFeedbacks(feedbacks);
  }

  const [fetching] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    if (deviceId) fetching();
  }, [setFeedbacks, setQuestions, deviceId, fetching]);

}

export default useOneDeviceFeedbacksFetching;