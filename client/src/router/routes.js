import CheckoutPage from "../pages/CheckoutPage";
import DesiredListPage from "../pages/DesiredListPage";
import DevicePage from "../pages/DevicePage";
import MainPage from "../pages/MainPage";
import RenavigatingCatalogPage from "../pages/RenavigatingCatalogPage";
import SalePage from "../pages/SalePage";
import SalesPage from "../pages/SalesPage";
import SellerPage from "../pages/SellerPage";
import UserPage from "../pages/UserPage";
import { BRAND_CATALOG_ROUTE, CATEGORY_CATALOG_ROUTE, CHECKOUT_ROUTE, DESIRED_LIST_ROUTE, DEVICE_COMMENTS_ROUTE, DEVICE_INFO_ROUTE, DEVICE_QUESTIONS_ROUTE, DEVICE_ROUTE, SALES_ROUTE, SEARCH_CATALOG_ROUTE, SELLER_DEVICES_ROUTE, SELLER_FEEDBACKS_ROUTE, SELLER_ROUTE, USER_ROUTE } from "../utils/consts";

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
  // all device-related pages will be rendered as DevicePage with different main content inside
  {
    path: DEVICE_ROUTE + ":deviceIdCombo",
    element: <DevicePage type="main" />,
  },
  {
    path: DEVICE_INFO_ROUTE,
    element: <DevicePage type="info" />,
  },
  {
    path: DEVICE_COMMENTS_ROUTE,
    element: <DevicePage type="comments" />,
  },
  {
    path: DEVICE_QUESTIONS_ROUTE,
    element: <DevicePage type="questions" />,
  },
  // same as with device-related pages
  {
    path: SELLER_ROUTE + ":sellerIdSlug",
    element: <SellerPage type="main" />,
  },
  {
    path: SELLER_FEEDBACKS_ROUTE,
    element: <SellerPage type="feedbacks" />,
  },
  {
    path: SELLER_DEVICES_ROUTE,
    element: <SellerPage type="devices" />,
  },
  {
    path: CHECKOUT_ROUTE,
    element: <CheckoutPage />
  },
  {
    path: SALES_ROUTE,
    element: <SalesPage />
  },
  {
    path: SALES_ROUTE + "/:saleIdSlug",
    element: <SalePage />
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