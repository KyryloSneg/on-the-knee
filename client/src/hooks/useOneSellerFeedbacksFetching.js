import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSellerFeedbacks } from "../http/FeedbacksAPI";

function useOneSellerFeedbacksFetching(sellerId, setFeedbacks = null) {
  const { app, deviceStore } = useContext(Context);

  async function fetchingCallback(propsSellerId) {
    const feedbacks = await getOneSellerFeedbacks(propsSellerId);
    
    if (setFeedbacks) {
      setFeedbacks(feedbacks);
    } else {
      deviceStore.setSellersFeedbacks(feedbacks);
    }
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(sellerId), 0, null, [sellerId]);
  useEffect(() => {
    app.setIsGlobalLoading(isLoading);
  }, [app, isLoading]);

  useEffect(() => {
    return () => app.setIsGlobalLoading(false);
  }, [app]);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useOneSellerFeedbacksFetching;