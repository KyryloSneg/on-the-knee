import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "../http/FeedbacksAPI";
import { getOneDeviceQuestions } from "../http/DeviceQuestionsAPI";
import CommentsActions from "utils/CommentsActions";
import { Context } from "Context";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";

// update fetch is the fetch that is used to refresh feedbacks, not to get them from zero
function useOneDeviceFeedbacksFetching(
  deviceId, setFeedbacks = null, setQuestions = null, isUpdateFetch = false,
  isToFetchFeedbacks = true, isToFetchQuestions = true, fetchStringQueryParams = "",
  isTopDevicePageFetch = false
) {
  const { deviceStore, fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

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
    if (!isUpdateFetch && isToFetchFeedbacks) setFeedbacksFn([]);
    if (!isUpdateFetch && isToFetchQuestions) setQuestionsFn([]);
    
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

    if (isTopDevicePageFetch) fetchRefStore.setLastDevicePageDeviceIdWithFetchedComments(id);

    return { feedbacks, questions };
  };

  const [fetching, isLoading] = useFetching(() => fetchingFunc(deviceId), 0, null, [deviceId]);

  useEffect(() => {
    const topDevicePageAdditionalCondition = (
      isTopDevicePageFetch
      && (
        (
          fetchRefStore.lastDevicePageDeviceIdWithFetchedComments === null
          || fetchRefStore.lastDevicePageDeviceIdWithFetchedComments === undefined
        )
        || fetchRefStore.lastDevicePageDeviceIdWithFetchedComments !== deviceId
      )
    );

    if (
      (deviceId !== null && deviceId !== undefined) && !isUpdateFetch
      && (isTopDevicePageFetch ? topDevicePageAdditionalCondition : true) 
    ) fetching();
  }, [
    setFeedbacks, setQuestions, deviceId, isToFetchFeedbacks, isToFetchQuestions, 
    isUpdateFetch, fetchStringQueryParams, isTopDevicePageFetch, fetching,
    fetchRefStore.lastDevicePageDeviceIdWithFetchedComments
  ]);

  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter, !isUpdateFetch);

  return fetching;
}

export default useOneDeviceFeedbacksFetching;