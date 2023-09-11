import { makeAutoObservable } from "mobx";

class DeviceStore {
  constructor() {
    this._filters = {
      "category": ["phones", "TV", "computers"],
      "brand": ["Apple", "Asus", "LG", "Samsung"],
      "hz": ["50", "60", "75", "120", "140", "144", "200", "240 and more"],
    }

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
    
    this._usedFilters = {};
    this._initialMinPrice = 1300;
    this._initialMaxPrice = 79900;
    // in the catalog page component or below in the tree we can use these states to calculate devices per page
    // (because we are filtering products on client side not on the server side) 
    this._devices = [];
    this._page = 1;
    this._totalCount = 0;
    this._limit = 15;
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
}

export default DeviceStore;