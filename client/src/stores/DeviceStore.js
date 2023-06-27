import { makeAutoObservable } from "mobx";

class DeviceStore {
  constructor() {
    this._filters = {
      "category": [],
      "price": [],
      "brand": [],
    }

    // just example
    this._usedFilters = {
      "category": [
        "phones",
      ],
      "price": [
        "10000-50000",
      ],
      "brand": [
        "Apple",
        "Samsung"
      ],
    }
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

  setUsedFilters(usedFilters) {
    this._usedFilters = usedFilters;
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
    this._page = limit;
  }

  get limit() {
    return this._limit;
  }
}

export default DeviceStore;