import { createRef } from "react";

// NOT a mobx store, just a regular one (changes here won't re-render components);
// it's used for optimization, fixing some minor bugs and increasing user experience
class FetchRefStore {
  // passing an argument to the createRef() doesn't do anything;
  // i do it to show it's initial (in the near future) value
  constructor() {
    // ref that is used to prevent the race of different changes of isGlobalLoading state
    this._globalLoadingChangesObj = createRef({});
    this._isAlreadyAddingViewedDevice = createRef(false);
    this._isAlreadyAddingViewedDeviceCleanupTimeoutId = createRef(null);

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
    this._lastDevicesFetchSortFilter = createRef(null);
    this._lastDevicesFetchPageFiltersObj = createRef({});
    this._lastDevicesFetchSearch = createRef(null);
    this._lastDevicesFetchSellerId = createRef(null);
    this._lastDevicesFetchSaleId = createRef(null);
    // { deviceId: ..., data: [...] }
    this._lastDevicesFetchAddServicesObj = createRef(null);

    this._lastSellerDevicesFetchUsedFilters = createRef(null);
    this._lastSellerDevicesFetchSortFilter = createRef(null);
    this._lastSellerDevicesFetchPageFiltersObj = createRef({});

    this._lastSaleDevicesFetchUsedFilters = createRef(null);
    this._lastSaleDevicesFetchSortFilter = createRef(null);
    this._lastSaleDevicesFetchPageFiltersObj = createRef({});

    this._lastSalePageSaleFetchResult = createRef(null);

    this._hasAlreadyFetchedUserOrders = createRef(false)
    this._hasAlreadyFetchedUserDevsFeedbacks = createRef(false)
    this._hasAlreadyFetchedOrdersListSellers = createRef(false)

    this._userPagePrevUserIdRef = createRef(null);
    this._userPagePrevOrdersRef = createRef(null);

    this._lastSalesPageSlug = createRef(null);
    this._lastSalesPageFetchPageFiltersObj = createRef(null);
  }

  get globalLoadingChangesObj() {
    // setting the initial value on the first call of this getter
    if (this._globalLoadingChangesObj.current === null) this._globalLoadingChangesObj.current = {};
    return this._globalLoadingChangesObj.current;
  }

  get isAlreadyAddingViewedDevice() {
    // setting the initial value on the first call of this getter
    if (this._isAlreadyAddingViewedDevice.current === null) this._isAlreadyAddingViewedDevice.current = false;
    return this._isAlreadyAddingViewedDevice.current;
  }

  get isAlreadyAddingViewedDeviceCleanupTimeoutId() {
    return this._isAlreadyAddingViewedDeviceCleanupTimeoutId.current;
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

  get lastDevicesFetchSortFilter() {
    return this._lastDevicesFetchSortFilter.current;
  }

  get lastDevicesFetchPageFiltersObj() {
    // setting the initial value on the first call of this getter
    if (this._lastDevicesFetchPageFiltersObj.current === null) this._lastDevicesFetchPageFiltersObj.current = {};
    return this._lastDevicesFetchPageFiltersObj.current;
  }

  get lastDevicesFetchSearch() {
    return this._lastDevicesFetchSearch.current;
  }

  get lastDevicesFetchSellerId() {
    return this._lastDevicesFetchSellerId.current;
  }

  get lastDevicesFetchSaleId() {
    return this._lastDevicesFetchSaleId.current;
  }

  get lastDevicesFetchAddServicesObj() {
    return this._lastDevicesFetchAddServicesObj.current;
  }

  get lastSellerDevicesFetchUsedFilters() {
    return this._lastSellerDevicesFetchUsedFilters.current;
  }

  get lastSellerDevicesFetchSortFilter() {
    return this._lastSellerDevicesFetchSortFilter.current;
  }

  get lastSellerDevicesFetchPageFiltersObj() {
    // setting the initial value on the first call of this getter
    if (this._lastSellerDevicesFetchPageFiltersObj.current === null) this._lastSellerDevicesFetchPageFiltersObj.current = {};
    return this._lastSellerDevicesFetchPageFiltersObj.current;
  }

  get lastSaleDevicesFetchUsedFilters() {
    return this._lastSaleDevicesFetchUsedFilters.current;
  }

  get lastSaleDevicesFetchSortFilter() {
    return this._lastSaleDevicesFetchSortFilter.current;
  }

  get lastSaleDevicesFetchPageFiltersObj() {
    // setting the initial value on the first call of this getter
    if (this._lastSaleDevicesFetchPageFiltersObj.current === null) this._lastSaleDevicesFetchPageFiltersObj.current = {};
    return this._lastSaleDevicesFetchPageFiltersObj.current;
  }

  get lastSalePageSaleFetchResult() {
    return this._lastSalePageSaleFetchResult.current;
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

  get lastSalesPageSlug() {
    return this._lastSalesPageSlug.current;
  }

  get lastSalesPageFetchPageFiltersObj() {
    // setting the initial value on the first call of this getter
    if (this._lastSalesPageFetchPageFiltersObj.current === null) this._lastSalesPageFetchPageFiltersObj.current = {};
    return this._lastSalesPageFetchPageFiltersObj.current;
  }

  setGlobalLoadingChangesObj(globalLoadingChangesObj) {
    this._globalLoadingChangesObj.current = globalLoadingChangesObj;
  }

  setIsAlreadyAddingViewedDevice(isAlreadyAddingViewedDevice) {
    this._isAlreadyAddingViewedDevice.current = isAlreadyAddingViewedDevice;
  }

  setIsAlreadyAddingViewedDeviceCleanupTimeoutId(isAlreadyAddingViewedDeviceCleanupTimeoutId) {
    this._isAlreadyAddingViewedDeviceCleanupTimeoutId.current = isAlreadyAddingViewedDeviceCleanupTimeoutId;
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

  setLastDevicesFetchSortFilter(lastDevicesFetchSortFilter) {
    this._lastDevicesFetchSortFilter.current = lastDevicesFetchSortFilter;
  }

  setLastDevicesFetchPageFiltersObj(lastDevicesFetchPageFiltersObj) {
    this._lastDevicesFetchPageFiltersObj.current = lastDevicesFetchPageFiltersObj;
  }

  setLastDevicesFetchSearch(lastDevicesFetchSearch) {
    this._lastDevicesFetchSearch.current = lastDevicesFetchSearch;
  }

  setLastDevicesFetchSellerId(lastDevicesFetchSellerId) {
    this._lastDevicesFetchSellerId.current = lastDevicesFetchSellerId;
  }

  setLastDevicesFetchSaleId(lastDevicesFetchSaleId) {
    this._lastDevicesFetchSaleId.current = lastDevicesFetchSaleId;
  }

  setLastDevicesFetchAddServicesObj(lastDevicesFetchAddServicesObj) {
    this._lastDevicesFetchAddServicesObj.current = lastDevicesFetchAddServicesObj;
  }

  setLastSellerDevicesFetchUsedFilters(lastSellerDevicesFetchUsedFilters) {
    this._lastSellerDevicesFetchUsedFilters.current = lastSellerDevicesFetchUsedFilters;
  }

  setLastSellerDevicesFetchSortFilter(lastSellerDevicesFetchSortFilter) {
    this._lastSellerDevicesFetchSortFilter.current = lastSellerDevicesFetchSortFilter;
  }

  setLastSellerDevicesFetchPageFiltersObj(lastSellerDevicesFetchPageFiltersObj) {
    this._lastSellerDevicesFetchPageFiltersObj.current = lastSellerDevicesFetchPageFiltersObj;
  }

  setLastSaleDevicesFetchUsedFilters(lastSaleDevicesFetchUsedFilters) {
    this._lastSaleDevicesFetchUsedFilters.current = lastSaleDevicesFetchUsedFilters;
  }

  setLastSaleDevicesFetchSortFilter(lastSaleDevicesFetchSortFilter) {
    this._lastSaleDevicesFetchSortFilter.current = lastSaleDevicesFetchSortFilter;
  }

  setLastSaleDevicesFetchPageFiltersObj(lastSaleDevicesFetchPageFiltersObj) {
    this._lastSaleDevicesFetchPageFiltersObj.current = lastSaleDevicesFetchPageFiltersObj;
  }

  setLastSalePageSaleFetchResult(lastSalePageSaleFetchResult) {
    this._lastSalePageSaleFetchResult.current = lastSalePageSaleFetchResult;
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

  setLastSalesPageSlug(lastSalesPageSlug) {
    this._lastSalesPageSlug.current = lastSalesPageSlug;
  }

  setLastSalesPageFetchPageFiltersObj(lastSalesPageFetchPageFiltersObj) {
    this._lastSalesPageFetchPageFiltersObj.current = lastSalesPageFetchPageFiltersObj;
  }
}

export default FetchRefStore;