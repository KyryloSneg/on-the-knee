import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSellerFeedbacks } from "../http/FeedbacksAPI";
import CommentsActions from "utils/CommentsActions";

// update fetch is the fetch that is used to refresh feedbacks, not to get them from zero
function useOneSellerFeedbacksFetching(sellerId, setFeedbacks = null, isUpdateFetch = false) {
  const { app, deviceStore } = useContext(Context);
  const sellerIdRef = useRef(sellerId);

  useEffect(() => {
    sellerIdRef.current = sellerId;
  }, [sellerId]);

  async function fetchingCallback() {
    const feedbacks = await getOneSellerFeedbacks(sellerIdRef.current);
    await CommentsActions.setCommentsUsers(feedbacks, "seller-feedbacks");
    
    if (setFeedbacks) {
      setFeedbacks(feedbacks);
    } else {
      deviceStore.setSellersFeedbacks(feedbacks);
    }
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    if ((sellerIdRef.current !== null && sellerIdRef.current !== undefined) && !isUpdateFetch) fetching();
  }, [sellerId, isUpdateFetch, fetching]);

  useEffect(() => {
    if (!isUpdateFetch) app.setIsGlobalLoading(isLoading);
  }, [app, isLoading, isUpdateFetch]);

  useEffect(() => {
    return () => { if (!isUpdateFetch) app.setIsGlobalLoading(false); };
  }, [app, isUpdateFetch]);

  return [fetching, isLoading, error];
}

export default useOneSellerFeedbacksFetching;