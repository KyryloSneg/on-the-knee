// import AppStore from "../stores/AppStore";
// import DeviceStore from "../stores/DeviceStore";
// import UserStore from "../stores/UserStore";

export const ROOT_ROUTE = "/";

export const DEVICE_ROUTE = "/device/"; // + :deviceIdCombo
export const DEVICE_INFO_ROUTE = "/device/:deviceIdCombo/info";
export const DEVICE_COMMENTS_ROUTE = "/device/:deviceIdCombo/comments";
export const DEVICE_QUESTIONS_ROUTE = "/device/:deviceIdCombo/questions";

export const SELLER_ROUTE = "/seller/"; // + :sellerIdSlug
export const SELLER_FEEDBACKS_ROUTE = "/seller/:sellerIdSlug/feedbacks";
export const SELLER_WRITE_A_FEEDBACK_ROUTE = "/seller/:sellerIdSlug/write-feedback";
export const SELLER_DEVICES_ROUTE = "/seller/:sellerIdSlug/devices";

export const CHECKOUT_ROUTE = "/checkout";

// adding user route to open the user orders page as a fallback
export const USER_ROUTE = "/user";
export const USER_PERSONAL_DATA_ROUTE = "/user/personal-data";
export const USER_ORDERS_ROUTE = "/user/orders";
export const USER_DESIRED_LIST_ROUTE = "/user/desired-list";
export const USER_VIEWED_DEVICES_ROUTE = "/user/viewed-devices";
export const USER_FEEDBACKS_ROUTE = "/user/my-feedbacks";
export const USER_SELLERS_FEEDBACKS_ROUTE = "/user/my-feedbacks/sellers";

export const CATEGORY_CATALOG_ROUTE = "/categories/"; // + ":categoryIdSlug" (1-smartphones for example)
export const BRAND_CATALOG_ROUTE = "/brand/" // + ":brandIdSlug" (2-asus for example);
export const SEARCH_CATALOG_ROUTE = "/search" // + ?text=value;

export const SALES_ROUTE = "/sales" // SALE_ROUTE is the same but + :saleIdSlug;

export const DEVICE_API_URL = "/devices?_embed=device-combinations&_embed=device-feedbacks&_embed=device-infos&_embed=sale-devices&_embed=additional-service-devices";
export const ONE_DEVICE_API_URL = "/devices/ID_TO_REPLACE?_embed=device-combinations&_embed=device-feedbacks&_embed=device-infos&_embed=sale-devices&_embed=additional-service-devices";
export const SALES_API_URL = "/sales?_embed=sale-types";
export const ATRIBUTES_API_URL = "/attributes?_expand=attribute-value&_expand=attribute-name";
export const ONE_ADDITIONAL_SERVICES_API_URL = "/additional-services/ID_TO_REPLACE";
export const ONE_DEV_ADDITIONAL_SERVICE_DEVICES_API_URL = "/additional-service-devices?deviceId=ID_TO_REPLACE";

export const DEVICE_FEEDBACKS_API_URL = "/device-feedbacks?_embed=device-feedback-replies&_embed=device-feedback-likes&_embed=device-feedback-dislikes";
export const ONE_DEVICE_FEEDBACKS_API_URL = "/device-feedbacks?deviceId=ID_TO_REPLACE&_embed=device-feedback-replies&_embed=device-feedback-likes&_embed=device-feedback-dislikes";

export const DEVICE_QUESTIONS_API_URL = "/device-questions?_embed=device-answers&_embed=device-question-likes&_embed=device-question-dislikes";
export const ONE_DEVICE_QUESTIONS_API_URL = "/device-questions?deviceId=ID_TO_REPLACE&_embed=device-answers&_embed=device-question-likes&_embed=device-question-dislikes";

export const ONE_SELLER_FEEDBACKS_API_URL = "/seller-feedbacks?sellerId=ID_TO_REPLACE";

export const ONE_CART_API_URL = "/carts?userId=USER_ID_TO_REPLACE";
export const ONE_CART_DEVICE_COMBINATIONS_API_URL = "/cart-device-combinations?_expand=device&_expand=device-combination&cartId=CART_ID_TO_REPLACE";

// value: (asc / desc),(rating / price)
export const sortingOptions = Object.freeze([
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
]);

export const DESIRED_LIST_PAGE_OPTIONS = Object.freeze([
  {
    id: 0,
    title: "By date added",
    value: "desc,date",
  },
  {
    id: 1,
    title: "increasing price",
    value: "asc,price",
  },
  {
    id: 2,
    title: "decreasing price",
    value: "desc,price",
  },
]);

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
// TODO: change to 12 in the production build
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
export const WIDTH_TO_SHOW_USER_PAGE_DESKTOP_VERSION = 1280;
export const WIDTH_TO_SHOW_USER_ORDERS_SEARCH_DESKTOP_VERSION = 420;

export const DEFAULT_USER_LOCATION_NAME = "Kyiv";
// coords of Kyiv
export const DEFAULT_INIT_MAP_COORDS = { lng: 30.5241361, lat: 50.4500336 };

// in dollars
export const TO_LIFT_ON_THE_FLOOR_PRICE = 6;

export const FIRST_CHECKOUT_ORDER_ID = 1;

export const CHECKOUT_PAGE_INPUT_SERVICE_CLASS = "dataset-checkout-page-input";
export const AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS = "dataset-auth-modal-input";
export const AUTHENTIFICATION_MODAL_SUBMIT_BTN_SERVICE_CLASS = "dataset-auth-modal-submit-btn";
export const CHANGE_PASSWORD_MODAL_SUBMIT_BTN_SERVICE_CLASS = "dataset-change-password-modal-submit-btn";

export const ERROR_MODAL_INITIAL_INFO = { children: "", id: "error-modal", className: "" };

export const ORDER_STATUS_COLOR_OBJ = {
  "Canceled": "#a10e0e",
  "Cancelled": "#a10e0e",
  "Pending": "#bd5e10",
  "Paid": "#ffa300",
  "Confirmed": "#00ed1f",
  "Done": "#00cd1c",
};

// let it be commented below because i don't write any tests rn
// (if you want to uncomment it, insert this code into a separate file
// to avoid cyclical import error between AppStore.js and this file)

// // set up mock stores
// const deviceStoreInstance = new DeviceStore();
// const userStoreInstance = new UserStore();

// deviceStoreInstance.setFilters({
//   "category": ["phones", "TV", "computers"],
//   "brand": ["Apple", "Asus", "LG", "Samsung"],
//   "hz": ["50", "60", "75", "120", "140", "144", "200", "240"],
// });

// deviceStoreInstance.setUsedFilters({});

// deviceStoreInstance.setInitialMinPrice(1300);
// deviceStoreInstance.setInitialMaxPrice(79900);

// // if i will be testing component that uses devices from store i should fill up the array with some of them
// deviceStoreInstance.setDevices([]);
// userStoreInstance.setIsAuth(true);

// // mock stores to use in tests
// export const mockContextValue = {
//   app: new AppStore(),
//   user: userStoreInstance,
//   deviceStore: deviceStoreInstance,
//   isTest: true,
// }