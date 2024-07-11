import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useCurrentPath from "./useCurrentPath";
import { CATEGORY_CATALOG_ROUTE, SEARCH_CATALOG_ROUTE, SELLER_DEVICES_ROUTE } from "../utils/consts";

function useScrollingToPagesTop() {
  const currentPath = useCurrentPath();
  const location = useLocation();

  useEffect(() => {
    if (currentPath 
        && !currentPath.startsWith(CATEGORY_CATALOG_ROUTE) 
        && !currentPath.startsWith(SEARCH_CATALOG_ROUTE)
        && !currentPath.startsWith(SELLER_DEVICES_ROUTE)
      ) {
      window.scrollTo(0, 0);
    }
  }, [location, currentPath]);
}

export default useScrollingToPagesTop;