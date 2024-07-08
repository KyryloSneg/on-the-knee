import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSellerFeedbacks } from "../http/FeedbacksAPI";

function useOneSellerFeedbacksFetching(sellerId, setFeedbacks = null) {
  const { app } = useContext(Context);

  async function fetchingCallback(propsSellerId) {
    const feedbacks = await getOneSellerFeedbacks(propsSellerId);
    
    if (setFeedbacks) {
      setFeedbacks(feedbacks);
    } else {
      app.setSellerFeedbacks(feedbacks);
    }
  }

  const [fetching, isLoading, error] = useFetching(() => fetchingCallback(sellerId), 0, null, [sellerId]);
  useEffect(() => {
    app.setIsGlobalLoading(isLoading);
  }, [app, isLoading]);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [fetching, isLoading, error];
}

export default useOneSellerFeedbacksFetching;