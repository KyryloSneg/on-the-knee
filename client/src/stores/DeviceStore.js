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
    this._deviceInfos = [];
    this._usedFilters = {};

    this._initialMinPrice = 0;
    this._initialMaxPrice = 0;

    this._devices = [];
    this._stocks = [];

    this._sales = [];
    this._saleTypeNames = [];

    this._categories = {};
    this._brands = {};
    
    this._page = 1;
    this._pagesToFetch = 1;
    this._totalCount = 0;
    // i can't import the DEVICE_ITEMS_MOBILE_LIMIT variable because of webpack-bootstrap error
    // it happens because of some cyclical imports (i'm lazy to fix this)
    this._limit = 30;
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

  setStocks(stocks) {
    this._stocks = stocks;
  }

  get stocks() {
    return this._stocks;
  }

  setDeviceInfos(deviceInfos) {
    this._deviceInfos = deviceInfos;
  }

  get deviceInfos() {
    return this._deviceInfos;
  }
}

export default DeviceStore;