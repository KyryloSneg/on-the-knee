import DeviceStore from "../stores/DeviceStore";

export const ROOT_ROUTE = "/";
export const CATALOG_ROUTE = "/catalog";
export const DEVICE_ROUTE = "/catalog/"; // + :deviceId
export const CHECKOUT_ROUTE = "/checkout";
export const USER_ROUTE = "/user"
// to do routing for user cabinet

export const sortingOptions = [
  {
    id: 0,
    title: "best rating",
    value: "best-rating",
  },
  {
    id: 1,
    title: "worst rating",
    value: "worst-rating",
  },
  {
    id: 2,
    title: "increasing price",
    value: "increasing-price",
  },
  {
    id: 3,
    title: "decreasing price",
    value: "decreasing-price",
  },
];

// in production build the value should be greater than current one
export const FILTERS_OPTIONS_LENGTH_LIMIT = 5;

// set up mock stores
const deviceStoreInstance = new DeviceStore();

deviceStoreInstance.setFilters({
  "category": ["phones", "TV", "computers"],
  "price": ["20000", "100", "10800", "4030"],
  "brand": ["Apple", "Asus", "LG", "Samsung"],
  "hz": ["50", "60", "75", "120", "140", "144", "200", "240"],
});

deviceStoreInstance.setUsedFilters({
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
});

deviceStoreInstance.setInitialMinPrice(1300);
deviceStoreInstance.setInitialMaxPrice(79900);

// if i will be testing component that uses devices from store i should fill up the array with some of them
deviceStoreInstance.setDevices([]);

// mock stores to use in tests
export const mockContextValue = {
  deviceStore: deviceStoreInstance,
}