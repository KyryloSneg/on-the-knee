import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";
import CommentsActions from "utils/CommentsActions";
import { Context } from "Context";

function useOneDeviceFeedbacksFetching(deviceId, setFeedbacks = null, setQuestions = null, deviceStore = null) {
  const { app } = useContext(Context);

  async function fetchingFunc(id) {
    // resetting feedbacks and questions
    if (setFeedbacks) setFeedbacks([]);
    if (setQuestions) setQuestions([]);
    
    if (deviceStore) {
      deviceStore.setDevicesFeedbacks([]);
      deviceStore.setDeviceQuestions([]);
    };

    const feedbacks = await getOneDeviceFeedbacks(id);
    const questions = await getOneDeviceQuestions(id);

    try {
      if (Array.isArray(questions)) await CommentsActions.setCommentsUsers(feedbacks, "device-questions");
      if (Array.isArray(feedbacks)) await CommentsActions.setCommentsUsers(feedbacks, "device-feedbacks");
    } catch (e) {
      console.log(e.message);  
    };

    if (setFeedbacks) setFeedbacks(feedbacks);
    if (setQuestions) setQuestions(questions);
    
    if (deviceStore) {
      deviceStore.setDevicesFeedbacks(feedbacks);
      deviceStore.setDeviceQuestions(questions);
    };
  };

  const [fetching, isLoading] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    if (deviceId) fetching();
  }, [setFeedbacks, setQuestions, deviceId, fetching]);

  useEffect(() => {
    app.setIsGlobalLoading(isLoading);
  }, [app, isLoading])

  useEffect(() => {
    return () => app.setIsGlobalLoading(false);
  }, [app]);
}

export default useOneDeviceFeedbacksFetching;