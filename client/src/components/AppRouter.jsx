import { CATALOG_ROUTE, CHECKOUT_ROUTE, USER_ROUTE, DEVICE_ROUTE } from "../utils/consts";
import MainPage from "../pages/MainPage";
import ErrorPage from "../pages/ErrorPage";
import CatalogPage from "../pages/CatalogPage";
import CheckoutPage from "../pages/CheckoutPage";
import DevicePage from "../pages/DevicePage";
import UserPage from "../pages/UserPage";
import { forwardRef, useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = observer(forwardRef((props, ref) => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {/* public routes */}
      <Route
        path={CATALOG_ROUTE}
        element={<CatalogPage ref={ref} />}
      />
      <Route
        path={DEVICE_ROUTE}
        element={<DevicePage ref={ref} />}
      />
      <Route
        path={CHECKOUT_ROUTE}
        element={<CheckoutPage ref={ref} />}
      />
      {/* if route is exactly equal to root route, it is the main page */}
      <Route
        index={true}
        element={<MainPage ref={ref} />}
      />

      {/* private routes */}
      <Route
        path={USER_ROUTE}
        element={
          <ProtectedRoute isAllowed={user.isAuth}>
            <UserPage ref={ref} />
          </ProtectedRoute>
        }
      />

      {/* asterisk "*" route that will be renavigating user to the error page */}
      <Route
        path="*"
        element={<ErrorPage ref={ref} />}
      />
    </Routes>
  );
}));

export default AppRouter;
