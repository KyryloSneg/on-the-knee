import {
  createBrowserRouter
} from "react-router-dom";
import App from "./App";
import { CATALOG_ROUTE, CHECKOUT_ROUTE, USER_ROUTE, DEVICE_ROUTE } from "./utils/consts";
import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/ErrorPage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import DevicePage from "./pages/DevicePage";
import UserPage from "./pages/UserPage";


const publicRoutes = [
  {
    path: CATALOG_ROUTE,
    element: <CatalogPage />,
  },
  {
    path: DEVICE_ROUTE,
    element: <DevicePage />,
  },
  {
    path: CHECKOUT_ROUTE,
    element: <CheckoutPage />,
  },
  {
    index: true, // if route is exactly equal to root route, it is the main page
    element: <MainPage />
  },
]

const privateRoutes = [
  {
    path: USER_ROUTE,
    element: <UserPage />,
  },
]

// TODO: UserStore
const isAuth = false;
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: 
      isAuth 
        ? [
          ...publicRoutes,
          ...privateRoutes
        ]
        : [
          ...publicRoutes
        ]
  }
])

export default router;