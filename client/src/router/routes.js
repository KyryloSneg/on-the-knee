import CatalogPage from "../pages/CatalogPage";
import CheckoutPage from "../pages/CheckoutPage";
import DevicePage from "../pages/DevicePage";
import MainPage from "../pages/MainPage";
import UserPage from "../pages/UserPage";
import { CATALOG_ROUTE, CHECKOUT_ROUTE, DEVICE_ROUTE, USER_ROUTE } from "../utils/consts";

export const PUBLIC_ROUTES = [
  {
    path: CATALOG_ROUTE,
    element: <CatalogPage />
  },
  {
    path: DEVICE_ROUTE + ":deviceId",
    element: <DevicePage />
  },
  {
    path: CHECKOUT_ROUTE,
    element: <CheckoutPage />
  },
  {
    index: true,
    element: <MainPage />
  },
];

export const PRIVATE_ROUTES = [
  {
    path: USER_ROUTE,
    element: <UserPage />
  },
];