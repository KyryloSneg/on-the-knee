import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { getOneSeller } from "../http/SellersAPI";
import { getOneSellerFeedbacks } from "http/FeedbacksAPI";
import { Context } from "Context";
import CommentsActions from "utils/CommentsActions";

// returns [{ seller: {...}, feedbacks: [...] }, ...]
function useOrdersListSellersFetching(orders, setSellerFeedbacksObjArray = null, deviceStore = null) {
  const { user } = useContext(Context);
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
  
          if (Array.isArray(userFeedbacks)) {
            await CommentsActions.setCommentsUsers(
              userFeedbacks, "seller-feedbacks", 
              { isToFetchFeedbacksUsers: true, isToFetchResponsesUsers: false }
            );
  
            sellersFeedbacks = sellersFeedbacks.concat(userFeedbacks);
          };
  
          const sellerFeedbacksObj = {
            seller,
            feedbacks: userFeedbacks || []
          };
  
          sellerFeedbacksObjArray.push(sellerFeedbacksObj);
        };
      };
    };

    if (setSellerFeedbacksObjArray) setSellerFeedbacksObjArray(sellerFeedbacksObjArray);
    if (deviceStore) deviceStore.setSellersFeedbacks(sellersFeedbacks);
  };

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    fetching();
  }, [orders, fetching]);

  return [fetching, isLoading, error];
}

export default useOrdersListSellersFetching;