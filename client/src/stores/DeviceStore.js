import { makeAutoObservable } from "mobx";

class DeviceStore {
  constructor() {
    this._filters = {};

    // {
    //   "category": ["phones", "TV", "computers"],
    //   "brand": ["Apple", "Asus", "LG", "Samsung"],
    //   "hz": ["50", "60", "75", "120", "140", "144", "200", "240 and more"],
    // }

    // just example

    // this._usedFilters = {
    //   "category": [
    //     "phones",
    //   ],
    //   "price": [
    //     "10000-50000",
    //   ],
    //   "brand": [
    //     "Apple",
    //     "Samsung"
    //   ],
    // }

    // for sorting filters section
    this._usedFilters = {};

    this._initialMinPrice = 0;
    this._initialMaxPrice = 0;

    this._devices = [];
    this._stocks = [];

    this._sales = [];
    this._saleTypeNames = [];
    this._hasTriedToFetchSales = false;

    this._categories = [];
    this._brands = [];

    // we moved states below from DevicePage to reload them on creating a feedback or a question
    this._devicesFeedbacks = [];
    this._deviceQuestions = [];

    this._sellersFeedbacks = [];

    // we use these states in modals that are related to the info below
    this._selectedDeviceId = null;
    this._selectedSellerId = null;

    this._selectedDeviceFeedbackId = null;
    this._selectedDeviceQuestionId = null;
    this._selectedSellerFeedbackId = null;

    this._deviceListItemsValues = null;
    
    this._page = 1;
    this._pagesToFetch = 1;
    this._totalCount = 0;
    this._limit = 40;
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this._filters = filters;
  }

  get filters() {
    return this._filters;
  }

  setUsedFilters(filters) {
    this._usedFilters = filters;
  }

  get usedFilters() {
    return this._usedFilters;
  }

  setAllDevices(allDevices) {
    this._allDevices = allDevices;
  }

  get allDevices() {
    return this._allDevices;
  }

  setDevices(devices) {
    this._devices = devices;
  }

  get devices() {
    return this._devices;
  }

  setPage(page) {
    this._page = page;
  }

  get page() {
    return this._page;
  }

  setPagesToFetch(pagesToFetch) {
    this._pagesToFetch = pagesToFetch;
  }

  get pagesToFetch() {
    return this._pagesToFetch;
  }

  setTotalCount(totalCount) {
    this._totalCount = totalCount;
  }

  get totalCount() {
    return this._totalCount;
  }

  setLimit(limit) {
    this._limit = limit;
  }

  get limit() {
    return this._limit;
  }

  setInitialMinPrice(initialMinPrice) {
    this._initialMinPrice = initialMinPrice;
  }

  get initialMinPrice() {
    return this._initialMinPrice;
  }

  setInitialMaxPrice(initialMaxPrice) {
    this._initialMaxPrice = initialMaxPrice;
  }

  get initialMaxPrice() {
    return this._initialMaxPrice;
  }

  setSales(sales) {
    this._sales = sales;
  }

  get sales() {
    return this._sales;
  }

  setSaleTypeNames(names) {
    this._saleTypeNames = names;
  }

  get saleTypeNames() {
    return this._saleTypeNames;
  }

  setHasTriedToFetchSales(names) {
    this._hasTriedToFetchSales = names;
  }

  get hasTriedToFetchSales() {
    return this._hasTriedToFetchSales;
  }

  setCategories(categories) {
    this._categories = categories;
  }

  get categories() {
    return this._categories;
  }

  setBrands(brands) {
    this._brands = brands;
  }

  get brands() {
    return this._brands;
  }

  setDevicesFeedbacks(deviceFeedbacks) {
    this._devicesFeedbacks = deviceFeedbacks;
  }

  get devicesFeedbacks() {
    return this._devicesFeedbacks;
  }

  setDeviceQuestions(deviceQuestions) {
    this._deviceQuestions = deviceQuestions;
  }

  get deviceQuestions() {
    return this._deviceQuestions;
  }

  setSellersFeedbacks(sellersFeedbacks) {
    this._sellersFeedbacks = sellersFeedbacks;
  }

  get sellersFeedbacks() {
    return this._sellersFeedbacks;
  }

  setSelectedDeviceId(selectedDeviceId) {
    this._selectedDeviceId = selectedDeviceId;
  }

  get selectedDeviceId() {
    return this._selectedDeviceId;
  }

  setSelectedSellerId(selectedSellerId) {
    this._selectedSellerId = selectedSellerId;
  }

  get selectedSellerId() {
    return this._selectedSellerId;
  }

  setSelectedDeviceFeedbackId(selectedDeviceFeedbackId) {
    this._selectedDeviceFeedbackId = selectedDeviceFeedbackId;
  }

  get selectedDeviceFeedbackId() {
    return this._selectedDeviceFeedbackId;
  }

  setSelectedDeviceQuestionId(selectedDeviceQuestionId) {
    this._selectedDeviceQuestionId = selectedDeviceQuestionId;
  }

  get selectedDeviceQuestionId() {
    return this._selectedDeviceQuestionId;
  }

  setSelectedSellerFeedbackId(selectedSellerFeedbackId) {
    this._selectedSellerFeedbackId = selectedSellerFeedbackId;
  }

  get selectedSellerFeedbackId() {
    return this._selectedSellerFeedbackId;
  }

  setDeviceListItemsValues(deviceListItemsValues) {
    this._deviceListItemsValues = deviceListItemsValues;
  }

  get deviceListItemsValues() {
    return this._deviceListItemsValues;
  }

  setStocks(stocks) {
    this._stocks = stocks;
  }

  get stocks() {
    return this._stocks;
  }
}

export default DeviceStore;