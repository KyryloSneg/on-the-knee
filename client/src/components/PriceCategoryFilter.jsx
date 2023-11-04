import { useContext, useEffect, useState } from "react";
import "./styles/PriceCategoryFilter.css";
import MinMaxPrice from "./MinMaxPrice";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import URLActions from "../utils/URLActions";
import { useNavigate } from "react-router-dom";

const PriceCategoryFilter = observer(() => {
  const { deviceStore } = useContext(Context);
  const navigate = useNavigate();

  const [minPriceValue, setMinPriceValue] = useState(deviceStore.initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState(deviceStore.initialMaxPrice);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // resetting input's values and "price" query param on devices min price or max one change
    const nextMinPrice = deviceStore.initialMinPrice;
    const nextMaxPrice = deviceStore.initialMaxPrice;

    setMinPriceValue(nextMinPrice);
    setMaxPriceValue(nextMaxPrice);
    
    const [queryMinPrice, queryMaxPrice] = URLActions.getParamValue("price")?.split("-") || [];
    const isSettedQueryPrice = queryMinPrice && queryMaxPrice;
    const resettedURL = URLActions.deleteParamValue("price", `${minPriceValue}-${maxPriceValue}`);
    const basename = process.env.REACT_APP_CLIENT_URL;

    if (resettedURL && 
      (isSettedQueryPrice && (+queryMinPrice !== nextMinPrice || +queryMaxPrice !== nextMaxPrice))) {
      navigate(resettedURL.replace(basename, ""), { replace: true });
    } 
  }, [deviceStore.initialMinPrice, deviceStore.initialMaxPrice]);

  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    // to prevent redundant redirects we can compare current price and new one
    // and if they're equal to each other we skip redirect
    const currentPrice = URLActions.getParamValue("price");
    if (currentPrice === `${minPriceValue}-${maxPriceValue}`) return;

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
