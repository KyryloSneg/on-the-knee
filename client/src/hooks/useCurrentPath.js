import { CATALOG_ROUTE, CHECKOUT_ROUTE, DESIRED_LIST_ROUTE, DEVICE_ROUTE, USER_ROUTE } from "../utils/consts";

const { useLocation, matchRoutes } = require("react-router-dom");

const routes = [
  { path: CATALOG_ROUTE}, 
  { path: DEVICE_ROUTE + ":deviceId"}, 
  { path: USER_ROUTE}, 
  { path: CHECKOUT_ROUTE}, 
  { path: DESIRED_LIST_ROUTE},
  { path: "/"}
];

function useCurrentPath() {
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);

  return route?.path || null;
} 

export default useCurrentPath;