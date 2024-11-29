import { Context } from "Context";
import { useCallback, useContext, useEffect, useRef } from "react";

export default function useUpdatingFeedbacksCbs(
  deviceId = null, sellerId = null, areUserFeedbacks, deviceFeedbacksFetching = null, sellerFeedbacksFetching = null, 
  userDevicesFeedbacksFetching = null, userSellersFeedbacksFetching = null
) {
  const { user, fetchRefStore } = useContext(Context);

  const deviceFeedbacksFetchingRef = useRef(deviceFeedbacksFetching);
  const sellerFeedbacksFetchingRef = useRef(sellerFeedbacksFetching);
  const userDevicesFeedbacksFetchingRef = useRef(userDevicesFeedbacksFetching);
  const userSellersFeedbacksFetchingRef = useRef(userSellersFeedbacksFetching);

  useEffect(() => {
    deviceFeedbacksFetchingRef.current = deviceFeedbacksFetching;
  }, [deviceFeedbacksFetching]);

  useEffect(() => {
    sellerFeedbacksFetchingRef.current = sellerFeedbacksFetching;
  }, [sellerFeedbacksFetching]);

  useEffect(() => {
    userDevicesFeedbacksFetchingRef.current = userDevicesFeedbacksFetching;
  }, [userDevicesFeedbacksFetching]);

  useEffect(() => {
    userSellersFeedbacksFetchingRef.current = userSellersFeedbacksFetching;
  }, [userSellersFeedbacksFetching]);

  // updates both devicesFeedbacks (usually deviceStore.devicesFeedbacks) 
  // and userDevsFeedbacks from the user page (usually user.userDevicesFeedbacks)
  const updateDeviceFeedbacksCb = useCallback(async () => {
    let devicesFeedbacksFetchingResult;

    if (user.isAuth) await userDevicesFeedbacksFetchingRef.current?.();
    if (areUserFeedbacks ? deviceId === fetchRefStore.lastDevicePageDeviceIdWithFetchedComments : true) {
      devicesFeedbacksFetchingResult = await deviceFeedbacksFetchingRef.current();
    }

    return devicesFeedbacksFetchingResult;
  }, [areUserFeedbacks, deviceId, fetchRefStore.lastDevicePageDeviceIdWithFetchedComments, user.isAuth]);

  // updates both sellersFeedbacks (usually deviceStore.sellersFeedbacks) 
  // and ordersListSellers from the user page (usually user.ordersListSellers)
  const updateSellerFeedbacksCb = useCallback(async () => {
    let sellersFeedbacksFetchingResult;

    if (user.isAuth) await userSellersFeedbacksFetchingRef.current?.();
    if (areUserFeedbacks ? sellerId === fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks : true) {
      sellersFeedbacksFetchingResult = await sellerFeedbacksFetchingRef.current?.();
    }
    
    return sellersFeedbacksFetchingResult;
  }, [areUserFeedbacks, sellerId, fetchRefStore.lastSellerPageSellerIdWithFetchedFeedbacks, user.isAuth]);

  return {
    updateDeviceFeedbacksCb,
    updateSellerFeedbacksCb
  };
}