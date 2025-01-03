import ErrorPage from "../pages/ErrorPage";
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from "./routes";
import { ROOT_ROUTE } from "../utils/consts";
import App from "../App";

export default function routerConfig(isAuth) {
  const childrenRoutes = (
    isAuth
      ? [
          ...PUBLIC_ROUTES.map(route => route),
          ...PRIVATE_ROUTES.map(route => route),
      ]
      : PUBLIC_ROUTES.map(route => route)
  );

  const result = [
    {
      path: ROOT_ROUTE,
      element: <App />,
      errorElement: <ErrorPage />,
      children: childrenRoutes
    }
  ];

  return result;
} 