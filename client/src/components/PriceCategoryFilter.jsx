import { useContext, useEffect, useRef, useState } from "react";
import "./styles/PriceCategoryFilter.css";
import MinMaxPrice from "./MinMaxPrice";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import URLActions from "../utils/URLActions";
import { useLocation, useNavigate } from "react-router-dom";
import validateMinMaxPrice from "../utils/validateMinMaxPrice";

const PriceCategoryFilter = observer(() => {
  const { deviceStore } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const prevInitialMinPrice = useRef(deviceStore.initialMinPrice);
  const prevInitialMaxPrice = useRef(deviceStore.initialMaxPrice);

  const [minPriceValue, setMinPriceValue] = useState(deviceStore.initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState(deviceStore.initialMaxPrice);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!deviceStore.initialMinPrice || !deviceStore.initialMaxPrice) return;

    const [queryMinPrice, queryMaxPrice] = URLActions.getParamValue("price")?.split("-") || [];
    if (queryMinPrice === null || queryMaxPrice === null) return;

    const isValidQueryMinPrice = validateMinMaxPrice(
      true,
      queryMinPrice,
      deviceStore.initialMinPrice,
      deviceStore.initialMaxPrice,
      queryMinPrice,
      queryMaxPrice
    );

    const isValidQueryMaxPrice = validateMinMaxPrice(
      false,
      queryMaxPrice,
      deviceStore.initialMinPrice,
      deviceStore.initialMaxPrice,
      queryMinPrice,
      queryMaxPrice
    );

    if (!isValidQueryMinPrice || !isValidQueryMaxPrice) {
      // renavigating user to the url without the price filter if out query prices aren't valid
      const basename = process.env.REACT_APP_CLIENT_URL;
      const nextURL = URLActions.deleteParamValue("price", `${minPriceValue}-${maxPriceValue}`);
      navigate(nextURL.replace(basename, ""), { replace: true });
    }

    // eslint-disable-next-line
  }, [location.search, navigate, deviceStore, deviceStore.initialMinPrice, deviceStore.initialMaxPrice]);

  useEffect(() => {
    // resetting input's values and "price" query param on devices min price or max one change
    const nextMinPrice = deviceStore.initialMinPrice;
    const nextMaxPrice = deviceStore.initialMaxPrice;

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
  }, [deviceStore.initialMinPrice, deviceStore.initialMaxPrice]);

  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    // to prevent redundant redirects we can compare current price and new one
    // and if they're equal to each other we skip redirect (or if we submitted the same price as initial one)

    const currentPrice = URLActions.getParamValue("price");
    if (currentPrice === `${minPriceValue}-${maxPriceValue}`
      || (minPriceValue === deviceStore.initialMinPrice && maxPriceValue === deviceStore.initialMaxPrice)) return;

    const nextUrl = URLActions.setNewParam("price", `${minPriceValue}-${maxPriceValue}`);
    const basename = process.env.REACT_APP_CLIENT_URL;
    navigate(nextUrl.replace(basename, ""));
  }

  return (
    <div className="price-range-form-wrap use-preety-scrollbar">
      <form className="price-range-filter-wrap" onSubmit={onSubmit}>
        <div>
          <MinMaxPrice
            variant={"min"}
            value={minPriceValue}
            setValue={setMinPriceValue}
            isValid={isValid}
            setIsValid={setIsValid}
            minPriceValue={minPriceValue}
            maxPriceValue={maxPriceValue}
          />
          <span className="price-divider no-select"> - </span>
          <MinMaxPrice
            variant={"max"}
            value={maxPriceValue}
            setValue={setMaxPriceValue}
            isValid={isValid}
            setIsValid={setIsValid}
            minPriceValue={minPriceValue}
            maxPriceValue={maxPriceValue}
          />
        </div>

        <button type="submit" disabled={!isValid} data-testid="price-category-filter-btn">
          OK
        </button>
      </form>
    </div>
  );
});

export default PriceCategoryFilter;
