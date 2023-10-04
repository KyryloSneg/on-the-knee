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
    this._devices = [
      {
        "id": 9,
        "name": "Infinix INBOOK",
        "rating": "4.5",
        "description": "Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey – 1 Year Warranty",
        "brandId": 57,
        "categoryId": 1,
        "sellerId": 9,
        "device-combinations": [
          {
            "id": 10,
            "combinationString": "phoneStorage:32GB-color:red#ff0000",
            "deviceId": 9,
            "sku": "BuATa6KG4YOS",
            "deviceCode": 967802608,
            "stockId": 10,
            "price": "1357.60",
            "thumbnail": "https://loremflickr.com/603/557?lock=7749057304854528",
            "images": [
              {
                "src": "https://picsum.photos/seed/KNF0IRE/603/557",
                "alt": "At similique accusamus."
              },
              {
                "src": "https://loremflickr.com/603/557?lock=448581358059520",
                "alt": "Sunt voluptas ea velit."
              }
            ],
            "default": false
          },
          {
            "id": 11,
            "combinationString": "phoneStorage:32GB-color:purple#a020f0",
            "deviceId": 9,
            "sku": "9FR7e8ng9i",
            "deviceCode": 924834359,
            "stockId": 11,
            "price": "924.60",
            "thumbnail": "https://loremflickr.com/603/557?lock=6091172837588992",
            "images": [
              {
                "src": "https://picsum.photos/seed/WdytI/603/557",
                "alt": "Maiores modi vel alias laboriosam."
              },
              {
                "src": "https://loremflickr.com/603/557?lock=499366387253248",
                "alt": "Repellat sit voluptatibus nobis fugiat."
              }
            ],
            "default": false
          },
          {
            "id": 12,
            "combinationString": "phoneStorage:64GB-color:red#ff0000",
            "deviceId": 9,
            "sku": "I4tUM8IyACzunC",
            "deviceCode": 206663551,
            "stockId": 12,
            "price": "850.20",
            "thumbnail": "https://picsum.photos/seed/kaTdiz/603/557",
            "images": [
              {
                "src": "https://loremflickr.com/603/557?lock=7083044265525248",
                "alt": "Voluptatum hic incidunt quisquam."
              },
              {
                "src": "https://picsum.photos/seed/i8GhFAtK8W/603/557",
                "alt": "Reprehenderit ratione est."
              }
            ],
            "default": false
          },
          {
            "id": 13,
            "combinationString": "phoneStorage:64GB-color:purple#a020f0",
            "deviceId": 9,
            "sku": "nU5f1PoEBoAtR1",
            "deviceCode": 488199725,
            "stockId": 13,
            "price": "445.00",
            "thumbnail": "https://loremflickr.com/603/557?lock=8129322000842752",
            "images": [
              {
                "src": "https://picsum.photos/seed/NFLqE/603/557",
                "alt": "Libero doloribus labore provident reprehenderit ut voluptatem ratione deserunt doloribus."
              },
              {
                "src": "https://picsum.photos/seed/1lR9QI/603/557",
                "alt": "Molestiae quo error deleniti."
              }
            ],
            "default": false
          },
          {
            "id": 14,
            "combinationString": "phoneStorage:128GB-color:red#ff0000",
            "deviceId": 9,
            "sku": "IEYCRTuHwXnI",
            "deviceCode": 687799564,
            "stockId": 14,
            "price": "3100.60",
            "thumbnail": "https://loremflickr.com/603/557?lock=7631605971550208",
            "images": [
              {
                "src": "https://picsum.photos/seed/loVQY/603/557",
                "alt": "Cumque beatae reprehenderit."
              },
              {
                "src": "https://loremflickr.com/603/557?lock=2682132663107584",
                "alt": "Maiores ea sed."
              }
            ],
            "default": false
          },
          {
            "id": 15,
            "combinationString": "phoneStorage:128GB-color:purple#a020f0",
            "deviceId": 9,
            "sku": "IxUVyhOU",
            "deviceCode": 629082838,
            "stockId": 15,
            "price": "3060.00",
            "thumbnail": "https://picsum.photos/seed/QGfqL8e5/603/557",
            "images": [
              {
                "src": "https://loremflickr.com/603/557?lock=800896390791168",
                "alt": "In molestias itaque doloribus sapiente consequatur."
              },
              {
                "src": "https://picsum.photos/seed/RQj7ORdE/603/557",
                "alt": "Dolorem laborum earum possimus et vel hic repellendus."
              }
            ],
            "default": true
          }
        ],
        "device-feedbacks": [
          {
            "id": 9,
            "deviceId": 9,
            "userId": {
              "$oid": "64e367f69f8167945dcb4a1b"
            },
            "images": [],
            "message": "Corrupti vel sunt nam. Libero impedit veniam aperiam minima tenetur maiores. Voluptas quidem tempora a.",
            "rate": 4.5,
            "date": "2023-10-03T02:29:55.505Z"
          }
        ],
        "device-infos": [
          {
            "id": 9,
            "deviceId": 9,
            "name": "processor",
            "value": "Mediatek"
          },
          {
            "id": 10,
            "deviceId": 9,
            "name": "hz",
            "value": "240"
          }
        ]
      }
    ];
    this._stocks = [
      {
        "id": 10,
        "stockStatus": "Out of stock",
        "totalStock": 28,
        "device-combinationId": 10
      },
      {
        "id": 11,
        "stockStatus": "Out of stock",
        "totalStock": 0,
        "device-combinationId": 11
      },
      {
        "id": 12,
        "stockStatus": "Out of stock",
        "totalStock": 0,
        "device-combinationId": 12
      },
      {
        "id": 13,
        "stockStatus": "Out of stock",
        "totalStock": 289,
        "device-combinationId": 13
      },
      {
        "id": 14,
        "stockStatus": "Out of stock",
        "totalStock": 1,
        "device-combinationId": 14
      },
      {
        "id": 15,
        "stockStatus": "Out of stock",
        "totalStock": 23,
        "device-combinationId": 15
      },
    ]
    this._sales = [

    ];
    // TODO to check is useful the state below
    this._saleTypeNames = [
      // {
      //   "id": 1,
      //   "name": "discount"
      // },
      // {
      //   "id": 2,
      //   "name": "freeDelivery"
      // }
    ];
    this._deviceInfos = [
      {
        "id": 9,
        "deviceId": 9,
        "name": "processor",
        "value": "Mediatek"
      },
      {
        "id": 10,
        "deviceId": 9,
        "name": "hz",
        "value": "240"
      }
    ]
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