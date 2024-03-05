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

  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);

  return route?.path || null;
}

export default useCurrentPath;