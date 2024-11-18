import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";
import CommentsActions from "utils/CommentsActions";
import { Context } from "Context";

// update fetch is the fetch that is used to refresh feedbacks, not to get them from zero
function useOneDeviceFeedbacksFetching(
  deviceId, setFeedbacks = null, setQuestions = null, isUpdateFetch = false,
  isToFetchFeedbacks = true, isToFetchQuestions = true, fetchStringQueryParams = ""
) {
  const { app, deviceStore } = useContext(Context);

  async function fetchingFunc(id) {
    function setFeedbacksFn(value) {
      if (setFeedbacks && isToFetchFeedbacks) {
        setFeedbacks(value);
      } else if (!setFeedbacks) {
        deviceStore.setDevicesFeedbacks(value);
      }
    }

    function setQuestionsFn(value) {
      if (setQuestions && isToFetchQuestions) {
        setQuestions(value);
      } else if (!setQuestions) {
        deviceStore.setDeviceQuestions(value);
      }
    }

    // resetting feedbacks and questions
    if (!isUpdateFetch) setFeedbacksFn([]);
    if (!isUpdateFetch) setQuestionsFn([]);
    
    let feedbacks;
    let questions;

    if (isToFetchFeedbacks) feedbacks = await getOneDeviceFeedbacks(id, fetchStringQueryParams);
    if (isToFetchQuestions) questions = await getOneDeviceQuestions(id, fetchStringQueryParams);

    try {
      if (Array.isArray(feedbacks)) await CommentsActions.setCommentsUsers(feedbacks, "device-feedbacks");
      if (Array.isArray(questions)) await CommentsActions.setCommentsUsers(questions, "device-questions");
    } catch (e) {
      console.log(e.message);  
    };

    if (isToFetchFeedbacks) setFeedbacksFn(feedbacks);
    if (isToFetchQuestions) setQuestionsFn(questions);
  };

  const [fetching, isLoading] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    if ((deviceId !== null && deviceId !== undefined) && !isUpdateFetch) fetching();
  }, [
    setFeedbacks, setQuestions, deviceId, isToFetchFeedbacks, isToFetchQuestions, 
    isUpdateFetch, fetchStringQueryParams, fetching
  ]);

  useEffect(() => {
    if (!isUpdateFetch) app.setIsGlobalLoading(isLoading);
  }, [app, isLoading, isUpdateFetch])

  useEffect(() => {
    return () => { if (!isUpdateFetch) app.setIsGlobalLoading(false); };
  }, [app, isUpdateFetch]);

  return fetching;
}

export default useOneDeviceFeedbacksFetching;