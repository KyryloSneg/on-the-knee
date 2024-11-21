import { createRef } from "react";

// NOT a mobx store, just a regular one (changes here won't re-render components);
// it's used for optimization and increasing user experience
class FetchRefStore {
  constructor() {
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
}

export default FetchRefStore;