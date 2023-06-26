import { makeAutoObservable } from "mobx";

class FiltersStore {
  constructor() {
    // this._filters = [
    //   {
    //     paramKey: "category",
    //     value: "phones",
    //   },
    //   {
    //     paramKey: "price",
    //     value: "10000 - 50000",
    //   },
    //   {
    //     paramKey: "brand",
    //     value: "Apple",
    //   },
    // ];

    this._filters = {
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
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this._filters = filters;
  }

  get filters() {
    return this._filters;
  }
}

export default FiltersStore;