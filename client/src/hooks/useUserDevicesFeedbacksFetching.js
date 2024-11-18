import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "http/FeedbacksAPI";
import { Context } from "Context";
import CommentsActions from "utils/CommentsActions";

function useUserDevicesFeedbacksFetching(
  deviceCombinations, setUserDevsFeedbacks = null, deviceStore = null,
  isToFetchFeedbacksUsers = true, isToFetchRepliesUsers = true, isToFetch = true
) {
  const { user } = useContext(Context);
  const deviceCombinationsRef = useRef(deviceCombinations);

  useEffect(() => {
    deviceCombinationsRef.current = deviceCombinations;
  }, [deviceCombinations]);

  async function fetchingCallback() {
    let userDevsFeedbacks = [];

    for (let combination of deviceCombinationsRef.current) {
      const userDevFeedbacks = await getOneDeviceFeedbacks(combination.deviceId, `&userId=${user.user?.id}`);
      await CommentsActions.setCommentsUsers(
        userDevFeedbacks, "device-feedbacks", 
        { isToFetchFeedbacksUsers: isToFetchFeedbacksUsers, isToFetchResponsesUsers: isToFetchRepliesUsers }
      );

      if (userDevFeedbacks) userDevsFeedbacks = userDevsFeedbacks.concat(userDevFeedbacks);
    };

    if (setUserDevsFeedbacks) setUserDevsFeedbacks(userDevsFeedbacks)
    else if (deviceStore) deviceStore.setDevicesFeedbacks(userDevsFeedbacks);
  };

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    if (isToFetch) fetching();
  }, [deviceCombinations, setUserDevsFeedbacks, isToFetch, deviceStore, fetching]);

  return [fetching, isLoading, error];
}

export default useUserDevicesFeedbacksFetching;