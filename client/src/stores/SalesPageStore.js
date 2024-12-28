import { makeAutoObservable } from "mobx";

class SalesPageStore {
  constructor() {
    // use unfiltered sales from the deviceStore
    this._filteredSales = [];
    this._saleTypes = [];

    this._selectedSaleTypeName = null;
    
    this._page = 1;
    this._pagesToFetch = 1;
    this._totalCount = 0;
    this._limit = 60;

    makeAutoObservable(this);
  }

  setFilteredSales(filteredSales) {
    this._filteredSales = filteredSales;
  }

  get filteredSales() {
    return this._filteredSales;
  }

  setSelectedSaleTypeName(selectedSaleTypeName) {
    this._selectedSaleTypeName = selectedSaleTypeName;
  }

  get selectedSaleTypeName() {
    return this._selectedSaleTypeName;
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

export default SalesPageStore;