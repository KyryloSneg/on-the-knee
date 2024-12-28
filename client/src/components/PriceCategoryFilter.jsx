import "./styles/PriceCategoryFilter.css";
import { useState } from "react";
import MinMaxPrice from "./MinMaxPrice";
import { observer } from "mobx-react-lite";
import URLActions from "../utils/URLActions";
import useResettingMinMaxPrices from "../hooks/useResettingMinMaxPrices";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import UIButton from "./UI/uiButton/UIButton";

const PriceCategoryFilter = observer(({ storeToUse }) => {
  const navigate = useNavigateToEncodedURL();

  const [minPriceValue, setMinPriceValue] = useState(storeToUse.initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState(storeToUse.initialMaxPrice);

  const [isValid, setIsValid] = useState(true);

  useResettingMinMaxPrices(
    storeToUse.initialMinPrice, storeToUse.initialMaxPrice,
    minPriceValue, maxPriceValue,
    setMinPriceValue, setMaxPriceValue,
  );

  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    // to prevent redundant redirects we can compare current price and new one
    // and if they're equal to each other we skip redirect (or if we submitted the same price as initial one)

    const currentPrice = URLActions.getParamValue("price");
    if (currentPrice === `${minPriceValue}-${maxPriceValue}`
      || (minPriceValue === storeToUse.initialMinPrice && maxPriceValue === storeToUse.initialMaxPrice && !currentPrice)) return;

    let nextUrl = URLActions.setNewParam("price", `${minPriceValue}-${maxPriceValue}`);
    nextUrl = URLActions.getURLWithResettedPageRelatedParams(nextUrl);
    
    const basename = process.env.REACT_APP_CLIENT_URL;
    navigate(nextUrl.replaceAll(basename, ""), { preventScrollReset: true });
  }

  return (
    <div className="price-range-form-wrap">
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
            storeToUse={storeToUse}
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
            storeToUse={storeToUse}
          />
        </div>

        <UIButton children="OK" type="submit" disabled={!isValid} data-testid="price-category-filter-btn" />
      </form>
    </div>
  );
});

export default PriceCategoryFilter;
