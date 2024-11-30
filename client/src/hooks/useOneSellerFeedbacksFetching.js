import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getOneSellerFeedbacks } from "../http/FeedbacksAPI";
import CommentsActions from "utils/CommentsActions";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";

// update fetch is the fetch that is used to refresh feedbacks, not to get them from zero
function useOneSellerFeedbacksFetching(
  sellerId, setFeedbacks = null, isUpdateFetch = false, isTopSellerPageFetch = false
) {
  const { deviceStore, fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();
  const sellerIdRef = useRef(sellerId);

  useEffect(() => {
    sellerIdRef.current = sellerId;
  }, [sellerId]);

  async function fetchingCallback() {
    function setFeedbacksValue(value) {
      if (setFeedbacks) {
        setFeedbacks(value);
      } else {
        deviceStore.setSellersFeedbacks(value);
      }
    }

    if (!isUpdateFetch) setFeedbacksValue([]);

    const feedbacks = await getOneSellerFeedbacks(sellerIdRef.current);
    await CommentsActions.setCommentsUsers(feedbacks, "seller-feedbacks");
    
    setFeedbacksValue(feedbacks);

    if (isTopSellerPageFetch) fetchRefStore.setLastSellerPageSellerIdWithFetchedFeedbacks(sellerIdRef.current);
    return feedbacks;
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    const topSellerPageAdditionalCondition = (
      isTopSellerPageFetch
      && (
        (
          fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks === null
          || fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks === undefined
        )
        || fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks !== sellerIdRef.current
      )
    );

    if (
      (sellerIdRef.current !== null && sellerIdRef.current !== undefined) 
      && !isUpdateFetch && (isTopSellerPageFetch ? topSellerPageAdditionalCondition : true) 
    ) fetching();
  }, [sellerId, isUpdateFetch, fetching, fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks, isTopSellerPageFetch]);

  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter, !isUpdateFetch);

  return [fetching, isLoading, error];
}

export default useOneSellerFeedbacksFetching;