import AppStore from "../stores/AppStore";
import DeviceStore from "../stores/DeviceStore";
import UserStore from "../stores/UserStore";

export const ROOT_ROUTE = "/";

export const DEVICE_ROUTE = "/device/"; // + :deviceIdCombo
export const DEVICE_INFO_ROUTE = "/device/:deviceIdCombo/info";
export const DEVICE_COMMENTS_ROUTE = "/device/:deviceIdCombo/comments";
export const DEVICE_QUESTIONS_ROUTE = "/device/:deviceIdCombo/questions";

export const CHECKOUT_ROUTE = "/checkout";
export const DESIRED_LIST_ROUTE = "/desired";
export const USER_ROUTE = "/user";
// TODO: routing for user cabinet

export const CATEGORY_CATALOG_ROUTE = "/categories/"; // + ":categoryIdSlug" (1-smartphones for example)
export const BRAND_CATALOG_ROUTE = "/brand/" // + ":brandIdSlug" (2-asus for example);
export const SEARCH_CATALOG_ROUTE = "/search" // + ?text=value;

export const SALES_ROUTE = "/sales" // SALE_ROUTE is the same but + :saleIdSlug;

export const DEVICE_API_URL = "/devices?_embed=device-combinations&_embed=device-feedbacks&_embed=device-infos&_embed=sale-devices&_embed=additional-service-devices";
export const ONE_DEVICE_API_URL = "/devices/ID_TO_REPLACE?_embed=device-combinations&_embed=device-feedbacks&_embed=device-infos&_embed=sale-devices&_embed=additional-service-devices";
export const SALES_API_URL = "/sales?_embed=sale-types";
export const ATRIBUTES_API_URL = "/attributes?_expand=attribute-value&_expand=attribute-name";
export const ONE_ADDITIONAL_SERVICES_API_URL = "/additional-services/ID_TO_REPLACE";

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

// export const mockSearchResults = {
//   "default": [
//     {
//       "id": 1,
//       "value": "gaming mouse",
//     },
//     {
//       "id": 2,
//       "value": "gaming keyboards",
//     },
//   ],
//   "history": [
//     {
//       "id": 3,
//       "value": "mice bloody",
//     },
//     {
//       "id": 4,
//       "value": "headphones",
//     },
//   ],
//   "categories": [
//     {
//       "id": 5,
//       "value": "mice",
//     },
//     {
//       "id": 6,
//       "value": "keyboards",
//     },
//   ]
// };

export const mockSearchResults = {
  "hint": [
    {
      "id": 1,
      "value": "gaming mouse",
    },
    {
      "id": 2,
      "value": "gaming keyboards",
    },
  ],
  "device": [
    {
      "id": 3,
      "value": "mice bloody",
    },
    {
      "id": 4,
      "value": "headphones",
    },
  ],
  "category": [
    {
      "id": 5,
      "value": "mice",
    },
    {
      "id": 6,
      "value": "keyboards",
    },
  ],
  "history": []
};

// params that don't appear in used filters like a sort filter
export const SPECIAL_QUERY_PARAMS = ["sort", "page", "pagesToFetch", "text", "categoryId"];

// filters that have unique filtration logic
export const SPECIAL_TO_HANDLE_FILTERS = ["sort", "price", "text", "stock", "seller", "brand"];

// filters that aren't placed in category filters
export const FILTERS_IN_SPECIAL_COMPONENTS = ["sort", "price", "text"];

export const HINT_SEARCH_RESULTS_MAX_AMOUNT = 3;
export const DEVICE_SEARCH_RESULTS_MAX_AMOUNT = 3;
export const CATEGORY_SEARCH_RESULTS_MAX_AMOUNT = 3;
export const HISTORY_SEARCH_RESULTS_MAX_AMOUNT = 6;

// renavigate user to categories page if subcategories amount >= MIN_CATEGORIES_LENGTH_TO_RENAVIGATE
// TODO: change to 12
export const MIN_CATEGORIES_LENGTH_TO_RENAVIGATE = 8;

// we use the const below on one of the columns overflow
export const CATEGORIES_COL_LVL_THREE_LIMIT = 8;

// TODO: in production build the values should be greater than current ones
export const FILTERS_OPTIONS_LENGTH_LIMIT = 6;
export const DEVICE_ITEM_INFO_AMOUNT_LIMIT = 6;

// unfortunately we can't use consts in css, so on changing the values below
// we must change it in css manually

// min-widths
export const WIDTH_TO_SHOW_DEV_HID_CONTENT = 960;
export const WIDTH_TO_SHOW_ASIDE = 960;
export const WIDTH_TO_SHOW_LOADING_BTN_PAGINATION = 260;
export const WIDTH_TO_SHOW_CATEGORIES_MENU = 1080;
export const WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR = 870;
export const WIDTH_TO_SHOW_BOTH_SELF_DELIVERY_MODAL_COLS = 800;
export const WIDTH_TO_SHOW_DEVICE_INFO_DL_SEPARATOR = 640;
export const WIDTH_TO_SHOW_PURCHASE_DEVICE_FOOTER = 340;

export const DEFAULT_USER_LOCATION_NAME = "Kyiv";
// coords of Kyiv
export const DEFAULT_INIT_MAP_COORDS = { lng: 30.5241361, lat: 50.4500336 };

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