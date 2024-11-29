import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { getOneSeller } from "../http/SellersAPI";
import { getOneSellerFeedbacks } from "http/FeedbacksAPI";
import { Context } from "Context";
import CommentsActions from "utils/CommentsActions";

// returns [{ seller: {...}, feedbacks: [...] }, ...]
function useOrdersListSellersFetching(
  orders, setSellerFeedbacksObjArray = null, isUserStore = false, 
  additionalCondition = true, isUpdateFetch = false
) {
  const { user, fetchRefStore } = useContext(Context);
  const ordersRef = useRef(orders);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  async function fetchingCallback() {
    let sellerFeedbacksObjArray = [];
    let sellersFeedbacks = [];

    for (let order of ordersRef.current) {
      const sellerId = order?.["order-device-combinations"]?.[0]?.["device-combination"]?.device?.sellerId;
      const isAlreadyAddedSeller = sellerFeedbacksObjArray.find(item => item.seller.id === sellerId);

      // adding only unique sellers
      if (!isAlreadyAddedSeller) {
        const seller = await getOneSeller(sellerId);
  
        if (seller) {
          const userFeedbacks = await getOneSellerFeedbacks(seller.id, `&userId=${user.user?.id}`);
          const sortedByDateFeedbacks = [...userFeedbacks].sort(
            (a, b) => b.date.localeCompare(a.date)
          );

          if (Array.isArray(sortedByDateFeedbacks)) {
            await CommentsActions.setCommentsUsers(
              sortedByDateFeedbacks, "seller-feedbacks", 
              { isToFetchFeedbacksUsers: true, isToFetchResponsesUsers: false }
            );
  
            sellersFeedbacks = sellersFeedbacks.concat(sortedByDateFeedbacks);
          };
  
          const sellerFeedbacksObj = {
            seller,
            feedbacks: sortedByDateFeedbacks || []
          };
  
          sellerFeedbacksObjArray.push(sellerFeedbacksObj);
        };
      };
    };

    if (setSellerFeedbacksObjArray) {
      setSellerFeedbacksObjArray(sellerFeedbacksObjArray)
      fetchRefStore.setHasAlreadyFetchedOrdersListSellers(true);
    } else if (isUserStore) {
      user.setOrdersListSellers(sellerFeedbacksObjArray)
      fetchRefStore.setHasAlreadyFetchedOrdersListSellers(true);
    };
  };

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    if (additionalCondition && !isUpdateFetch) fetching();
  }, [orders, additionalCondition, isUpdateFetch, fetching]);

  return [fetching, isLoading, error];
}

export default useOrdersListSellersFetching;