import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { getOneDeviceFeedbacks } from "http/FeedbacksAPI";
import { Context } from "Context";
import CommentsActions from "utils/CommentsActions";

function useUserDevicesFeedbacksFetching(
  deviceCombinations = null, setUserDevsFeedbacks = null, isUserStore = false,
  isToFetchFeedbacksUsers = true, isToFetchRepliesUsers = true, isToFetch = true,
) {
  const { user, fetchRefStore } = useContext(Context);
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

    if (setUserDevsFeedbacks) {
      setUserDevsFeedbacks(userDevsFeedbacks)
      fetchRefStore.setHasAlreadyFetchedUserDevsFeedbacks(true);
    } else if (isUserStore) {
      user.setUserDevicesFeedbacks(userDevsFeedbacks)
      fetchRefStore.setHasAlreadyFetchedUserDevsFeedbacks(true);
    };
  };

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    if (isToFetch && deviceCombinationsRef.current) fetching();
  }, [deviceCombinations, setUserDevsFeedbacks, isToFetch, isUserStore, fetching]);

  return [fetching, isLoading, error];
}

export default useUserDevicesFeedbacksFetching;