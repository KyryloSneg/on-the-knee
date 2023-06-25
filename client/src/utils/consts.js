export const CATALOG_ROUTE = "/catalog";
export const DEVICE_ROUTE = "/catalog/:deviceId";
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