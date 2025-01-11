import { useEffect, useRef } from "react";
import getPreparedForMockServerStr from "../utils/getPreparedForMockServerStr";
import URLActions from "../utils/URLActions";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import { CLIENT_URL } from "utils/consts";

export default function useGettingSortedUserPageOrders(orders) {
  const navigate = useNavigateToEncodedURL();
  const urlToNavigateToRef = useRef(null)
  const orderQuery = URLActions.getParamValue("orderQuery")

  let filteredOrders;
  
  function replaceInvalidParam() {
    let urlToNavigateTo = null;
    
    if (orderQuery?.trim() === "") {
      urlToNavigateTo = URLActions.deleteParamValue("orderQuery", orderQuery);
    } else {
      // we can't pass some symbols in orderQuery param
      const newOrderQuery = getPreparedForMockServerStr(orderQuery);
      if (newOrderQuery !== orderQuery) {
        urlToNavigateTo = URLActions.setNewParam("orderQuery", newOrderQuery);
      };
    }

    urlToNavigateToRef.current = urlToNavigateTo;
  }

  if (orderQuery !== null) {
    replaceInvalidParam();
    if (!urlToNavigateToRef.current) {
      filteredOrders = orders?.filter(order => 
        order?.orderName?.toString().replaceAll(" ", "").startsWith(orderQuery.replaceAll(" ", ""))
      );
    }
  }

  useEffect(() => {
    const basename = CLIENT_URL;
    if (urlToNavigateToRef.current) navigate(urlToNavigateToRef.current.replace(basename, ""), { replace: true });

    // just in case
    urlToNavigateToRef.current = null;
  }, [urlToNavigateToRef, navigate]);

  // return orders as a fallback if there's no orderQuery param 
  // or the server returns something inappropriate
  return filteredOrders || orders;
};