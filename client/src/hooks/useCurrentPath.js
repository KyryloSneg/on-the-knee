import { useMemo } from "react";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../router/routes";
const { useLocation, matchRoutes } = require("react-router-dom");

function useCurrentPath() {
  // we can't calculate it on initialization
  const publicRoutes = useMemo(() => {
    return PUBLIC_ROUTES.map(route => ({ path: route.path }));
  }, []);

  const privateRoutes = useMemo(() => {
    return PRIVATE_ROUTES.map(route => ({ path: route.path }));
  }, []);

  const routes = publicRoutes.concat(privateRoutes);

  let route;

  const location = useLocation();
  const matchRoutesResult = matchRoutes(routes, location);

  // matchRoutes on the main page with route "/" do not return [{...}, ...] ig
  if (matchRoutesResult) {
    route = matchRoutesResult[0]["route"]
  }

  return route?.path || null;
}

export default useCurrentPath;