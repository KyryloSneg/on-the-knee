import {
  Routes,
  createBrowserRouter, createRoutesFromElements
} from "react-router-dom";
import App from "./App";
import { CATALOG_ROUTE, CHECKOUT_ROUTE, USER_ROUTE, DEVICE_ROUTE } from "./utils/consts";
import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/ErrorPage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import DevicePage from "./pages/DevicePage";
import UserPage from "./pages/UserPage";
import { useContext } from "react";
import { Context } from "./index";
import AppRoutes from "./components/AppRouter";
import { Route } from "react-router-dom";

const publicRoutes = [
  <Route 
    path={CATALOG_ROUTE}
    element={<CatalogPage />}
  />,
  <Route 
    path={DEVICE_ROUTE}
    element={<DevicePage />}
  />,
  <Route 
    path={CHECKOUT_ROUTE}
    element={<CheckoutPage />}
  />,
  <Route 
    index={true}
    element={<MainPage />} // if route is exactly equal to root route, it is the main page
  />,
]

const privateRoutes = [
  <Route 
    path={USER_ROUTE}
    element={<UserPage />}
  />,
]

const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route
    //   path="/" 
    //   element={<App />}
    //   errorElement={<ErrorPage />}
    // >
    //   {true
    //     ? [...publicRoutes, ...privateRoutes]
    //     : [...publicRoutes]
    //   }
    // </Route>
    <AppRoutes />
  )
)
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: 
//       isAuth 
//         ? [
//           ...publicRoutes,
//           ...privateRoutes
//         ]
//         : [
//           ...publicRoutes
//         ]
//   }
// ])

export default router;