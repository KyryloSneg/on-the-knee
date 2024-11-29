import { createRef } from "react";

// NOT a mobx store, just a regular one (changes here won't re-render components);
// it's used for optimization, fixing some minor bugs and increasing user experience
class FetchRefStore {
  // passing an argument to the createRef() doesn't do anything;
  // i do it to show it's initial (in the near future) value
  constructor() {
    // ref that is used to prevent the race of different changes of isGlobalLoading state
    this._globalLoadingChangesObj = createRef({});

    this._lastSellerPageSellerFetchResult = createRef(null); 
    // id of the seller which feedbacks are fetched last time
    this._lastSellerPageSellerIdWithFetchedFeedbacks = createRef(null); 

    this._lastDevicePageDeviceFetchResult = createRef(null); 
    // id of the device which feedbacks are fetched last time
    this._lastDevicePageDeviceIdWithFetchedComments = createRef(null); 
    this._lastDevicePageDeviceIdWithSeller = createRef(null); 
    this._lastDevicePageFetchSeller = createRef(null); 

    this._lastDevicesFetchCategoryId = createRef(null);
    this._lastDevicesFetchUsedFilters = createRef(null);
    this._lastDevicesFetchSearch = createRef(null);
    this._lastDevicesFetchSellerId = createRef(null);

    this._hasAlreadyFetchedUserOrders = createRef(false)
    this._hasAlreadyFetchedUserDevsFeedbacks = createRef(false)
    this._hasAlreadyFetchedOrdersListSellers = createRef(false)

    this._userPagePrevUserIdRef = createRef(null);
    this._userPagePrevOrdersRef = createRef(null);
  }

  get globalLoadingChangesObj() {
    // setting the initial value on the first call of this getter
    if (this._globalLoadingChangesObj.current === null) this._globalLoadingChangesObj.current = {};
    return this._globalLoadingChangesObj.current;
  }

  get lastSellerPageSellerFetchResult() {
    return this._lastSellerPageSellerFetchResult.current;
  }

  get lastSellerPageSellerIdWithFetchedFeedbacks() {
    return this._lastSellerPageSellerIdWithFetchedFeedbacks.current;
  }

  get lastDevicePageDeviceFetchResult() {
    return this._lastDevicePageDeviceFetchResult.current;
  }

  get lastDevicePageDeviceIdWithFetchedComments() {
    return this._lastDevicePageDeviceIdWithFetchedComments.current;
  }

  get lastDevicePageFetchSeller() {
    return this._lastDevicePageFetchSeller.current;
  }

  get lastDevicesFetchCategoryId() {
    return this._lastDevicesFetchCategoryId.current;
  }

  get lastDevicesFetchUsedFilters() {
    return this._lastDevicesFetchUsedFilters.current;
  }

  get lastDevicesFetchSearch() {
    return this._lastDevicesFetchSearch.current;
  }

  get lastDevicesFetchSellerId() {
    return this._lastDevicesFetchSellerId.current;
  }

  get hasAlreadyFetchedUserOrders() {
    // setting the initial value on the first call of this getter
    if (this._hasAlreadyFetchedUserOrders.current === null) this._hasAlreadyFetchedUserOrders.current = false;
    return this._hasAlreadyFetchedUserOrders.current;
  }

  get hasAlreadyFetchedUserDevsFeedbacks() {
    // setting the initial value on the first call of this getter
    if (this._hasAlreadyFetchedUserDevsFeedbacks.current === null) this._hasAlreadyFetchedUserDevsFeedbacks.current = false;
    return this._hasAlreadyFetchedUserDevsFeedbacks.current;
  }

  get hasAlreadyFetchedOrdersListSellers() {
    // setting the initial value on the first call of this getter
    if (this._hasAlreadyFetchedOrdersListSellers.current === null) this._hasAlreadyFetchedOrdersListSellers.current = false;
    return this._hasAlreadyFetchedOrdersListSellers.current;
  }

  get userPagePrevUserIdRef() {
    return this._userPagePrevUserIdRef.current;
  }

  get userPagePrevOrdersRef() {
    return this._userPagePrevOrdersRef.current;
  }

  setGlobalLoadingChangesObj(globalLoadingChangesObj) {
    this._globalLoadingChangesObj.current = globalLoadingChangesObj;
  }

  setLastSellerPageSellerFetchResult(lastSellerPageSellerFetchResult) {
    this._lastSellerPageSellerFetchResult.current = lastSellerPageSellerFetchResult;
  }

  setLastSellerPageSellerIdWithFetchedFeedbacks(lastSellerPageSellerIdWithFetchedFeedbacks) {
    this._lastSellerPageSellerIdWithFetchedFeedbacks.current = lastSellerPageSellerIdWithFetchedFeedbacks;
  }

  setLastDevicePageDeviceFetchResult(lastDevicePageDeviceFetchResult) {
    this._lastDevicePageDeviceFetchResult.current = lastDevicePageDeviceFetchResult;
  }

  setLastDevicePageDeviceIdWithFetchedComments(lastDevicePageDeviceIdWithFetchedComments) {
    this._lastDevicePageDeviceIdWithFetchedComments.current = lastDevicePageDeviceIdWithFetchedComments;
  }

  setLastDevicePageFetchSeller(lastDevicePageFetchSeller) {
    this._lastDevicePageFetchSeller.current = lastDevicePageFetchSeller;
  }

  setLastDevicesFetchCategoryId(lastDevicesFetchCategoryId) {
    this._lastDevicesFetchCategoryId.current = lastDevicesFetchCategoryId;
  }

  setLastDevicesFetchUsedFilters(lastDevicesFetchUsedFilters) {
    this._lastDevicesFetchUsedFilters.current = lastDevicesFetchUsedFilters;
  }

  setLastDevicesFetchSearch(lastDevicesFetchSearch) {
    this._lastDevicesFetchSearch.current = lastDevicesFetchSearch;
  }

  setLastDevicesFetchSellerId(lastDevicesFetchSellerId) {
    this._lastDevicesFetchSellerId.current = lastDevicesFetchSellerId;
  }
  
  setHasAlreadyFetchedUserOrders(hasAlreadyFetchedUserOrders) {
    this._hasAlreadyFetchedUserOrders.current = hasAlreadyFetchedUserOrders;
  }

  setHasAlreadyFetchedUserDevsFeedbacks(hasAlreadyFetchedUserDevsFeedbacks) {
    this._hasAlreadyFetchedUserDevsFeedbacks.current = hasAlreadyFetchedUserDevsFeedbacks;
  }

  setHasAlreadyFetchedOrdersListSellers(hasAlreadyFetchedOrdersListSellers) {
    this._hasAlreadyFetchedOrdersListSellers.current = hasAlreadyFetchedOrdersListSellers;
  }

  setUserPagePrevUserIdRef(userPagePrevUserIdRef) {
    this._userPagePrevUserIdRef.current = userPagePrevUserIdRef;
  }

  setUserPagePrevOrdersRef(userPagePrevOrdersRef) {
    this._userPagePrevOrdersRef.current = userPagePrevOrdersRef;
  }
}

export default FetchRefStore;