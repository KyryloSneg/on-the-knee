import { makeAutoObservable } from "mobx";

class OneSalePageStore {
  constructor() {
    this._sale = null;

    this._devices = [];
    this._filters = {};
    this._usedFilters = {};

    this._initialMinPrice = 0;
    this._initialMaxPrice = 0;

    this._page = 1;
    this._pagesToFetch = 1;
    this._totalCount = 0;
    this._limit = 1;

    makeAutoObservable(this);
  }

  setSale(sale) {
    this._sale = sale;
  }

  get sale() {
    return this._sale;
  }

  setDevices(devices) {
    this._devices = devices;
  }

  get devices() {
    return this._devices;
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
}

export default OneSalePageStore;