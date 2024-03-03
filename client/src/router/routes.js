import CheckoutPage from "../pages/CheckoutPage";
import DesiredListPage from "../pages/DesiredListPage";
import DevicePage from "../pages/DevicePage";
import MainPage from "../pages/MainPage";
import RenavigatingCatalogPage from "../pages/RenavigatingCatalogPage";
import UserPage from "../pages/UserPage";
import { BRAND_CATALOG_ROUTE, CATEGORY_CATALOG_ROUTE, CHECKOUT_ROUTE, DESIRED_LIST_ROUTE, DEVICE_ROUTE, SEARCH_CATALOG_ROUTE, USER_ROUTE } from "../utils/consts";

export const PUBLIC_ROUTES = [
  {
    path: CATEGORY_CATALOG_ROUTE + ":categoryIdSlug",
    element: <RenavigatingCatalogPage type="category" />,
  },
  {
    path: BRAND_CATALOG_ROUTE + ":brandIdSlug",
    element: <RenavigatingCatalogPage type="brand" />,
  },
  {
    path: SEARCH_CATALOG_ROUTE,
    element: <RenavigatingCatalogPage type="search" />
  },
  {
    path: DEVICE_ROUTE + ":deviceId",
    element: <DevicePage />,
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
  {
    path: DESIRED_LIST_ROUTE,
    element: <DesiredListPage />
  }
];