import { useLocation } from "react-router-dom";
import URLActions from "../utils/URLActions";
import checkMinMaxPricesValidity from "../utils/checkMinMaxPricesValidity";
import { useEffect, useRef } from "react";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";

function useResettingMinMaxPrices(initialMinPrice, initialMaxPrice, minPriceValue, maxPriceValue, setMinPriceValue, setMaxPriceValue) {
  const location = useLocation();
  const navigate = useNavigateToEncodedURL();

  const prevInitialMinPrice = useRef(initialMinPrice);
  const prevInitialMaxPrice = useRef(initialMaxPrice);

  // idk how it even works but it does
  useEffect(() => {
    const result = checkMinMaxPricesValidity(initialMinPrice, initialMaxPrice);
    if (result) {
      const {
        isValidQueryMinPrice,
        isValidQueryMaxPrice,
        isChangedMinInitPrice,
        isChangedMaxInitPrice,
      } = result;

      // because of submitting price filter initial min / max prices are changing to new ones
      // our submitted prices can be invalid very often (when min price < initial min price; same thing with max price),
      // so renavigate our user to page with initial prices setted on

      if (isChangedMinInitPrice || isChangedMaxInitPrice) return;
      if (!isValidQueryMinPrice || !isValidQueryMaxPrice) {
        // renavigating user to the url without the price filter if our query prices aren't valid
        const basename = process.env.REACT_APP_CLIENT_URL;
        const nextURL = URLActions.deleteParamValue("price", `${minPriceValue}-${maxPriceValue}`);
        
        navigate(nextURL.replace(basename, ""), { replace: true });
      }
    }

    // eslint-disable-next-line
  }, [location.search, navigate, initialMinPrice, initialMaxPrice]);

  useEffect(() => {
    // resetting input's values and "price" query param on devices min price or max one change
    const nextMinPrice = initialMinPrice;
    const nextMaxPrice = initialMaxPrice;

    setMinPriceValue(nextMinPrice);
    setMaxPriceValue(nextMaxPrice);

    const isInitialPricesAreSame = prevInitialMinPrice !== nextMinPrice || prevInitialMinPrice !== nextMaxPrice;
    if (isInitialPricesAreSame) return;

    const [queryMinPrice, queryMaxPrice] = URLActions.getParamValue("price")?.split("-") || [];
    const isSettedQueryPrice = queryMinPrice && queryMaxPrice;
    const resettedURL = URLActions.deleteParamValue("price", `${minPriceValue}-${maxPriceValue}`);
    const basename = process.env.REACT_APP_CLIENT_URL;

    if (resettedURL && isSettedQueryPrice) {
      navigate(resettedURL.replace(basename, ""), { replace: true });
    }

    prevInitialMinPrice.current = nextMinPrice;
    prevInitialMaxPrice.current = nextMaxPrice;
    // eslint-disable-next-line
  }, [initialMinPrice, initialMaxPrice]);

}

export default useResettingMinMaxPrices;