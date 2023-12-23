import AppStore from "../stores/AppStore";
import DeviceStore from "../stores/DeviceStore";
import UserStore from "../stores/UserStore";

export const ROOT_ROUTE = "/";
export const CATALOG_ROUTE = "/catalog";
export const DEVICE_ROUTE = "/catalog/"; // + :deviceId
export const CHECKOUT_ROUTE = "/checkout";
export const USER_ROUTE = "/user";
export const DESIRED_LIST_ROUTE = "/desired";
// to do routing for user cabinet

export const DEVICE_API_URL = "/devices?_embed=device-combinations&_embed=device-feedbacks&_embed=device-infos&_embed=sale-devices";
export const SALES_API_URL = "/sales?_embed=sale-types";
export const ATRIBUTES_API_URL = "/attributes?_expand=attribute-value&_expand=attribute-name";


// value: (asc / desc),(rating / price)
export const sortingOptions = [
  {
    id: 0,
    title: "best rating",
    // comma will become %2C in the url
    value: "desc,rating",
  },
  {
    id: 1,
    title: "worst rating",
    value: "asc,rating",
  },
  {
    id: 2,
    title: "increasing price",
    value: "asc,price",
  },
  {
    id: 3,
    title: "decreasing price",
    value: "desc,price",
  },
];

export const mockSearchResults = {
  "default": [
    {
      "id": 1,
      "value": "gaming mouse",
    },
    {
      "id": 2,
      "value": "gaming keyboards",
    },
  ],
  "history": [
    {
      "id": 3,
      "value": "mice bloody",
    },
    {
      "id": 4,
      "value": "headphones",
    },
  ],
  "categories": [
    {
      "id": 5,
      "value": "mice",
    },
    {
      "id": 6,
      "value": "keyboards",
    },
  ]
};

// params that don't appear in used filters like a sort filter
export const SPECIAL_QUERY_PARAMS = ["sort", "page", "pagesToFetch"];

// filters that have unique filtration logic
export const SPECIAL_TO_HANDLE_FILTERS = ["sort", "price", "text", "stock", "seller", "brand"];

// filters that aren't placed in category filters
export const FILTERS_IN_SPECIAL_COMPONENTS = ["sort", "price", "text"];

// in production build the value should be greater than current one
export const FILTERS_OPTIONS_LENGTH_LIMIT = 5;
export const DEVICE_ITEM_INFO_AMOUNT_LIMIT = 6;
export const DEVICE_ITEMS_MOBILE_LIMIT = 30;
export const DEVICE_ITEMS_DESKTOP_LIMIT = 60;

// min-widths
export const WIDTH_TO_SHOW_DEV_HID_CONTENT = 960;
export const WIDTH_TO_SHOW_LOADING_BTN_PAGINATION = 260;

// set up mock stores
const deviceStoreInstance = new DeviceStore();
const userStoreInstance = new UserStore();

deviceStoreInstance.setFilters({
  "category": ["phones", "TV", "computers"],
  "brand": ["Apple", "Asus", "LG", "Samsung"],
  "hz": ["50", "60", "75", "120", "140", "144", "200", "240"],
});

deviceStoreInstance.setUsedFilters({});

deviceStoreInstance.setInitialMinPrice(1300);
deviceStoreInstance.setInitialMaxPrice(79900);

// if i will be testing component that uses devices from store i should fill up the array with some of them
deviceStoreInstance.setDevices([]);
userStoreInstance.setIsAuth(true);

// mock stores to use in tests
export const mockContextValue = {
  app: new AppStore(),
  user: userStoreInstance,
  deviceStore: deviceStoreInstance,
  isTest: true,
}