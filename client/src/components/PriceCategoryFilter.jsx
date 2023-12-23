import { useContext, useState } from "react";
import "./styles/PriceCategoryFilter.css";
import MinMaxPrice from "./MinMaxPrice";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import URLActions from "../utils/URLActions";
import useResettingMinMaxPrices from "../hooks/useResettingMinMaxPrices";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";

const PriceCategoryFilter = observer(() => {
  const { deviceStore } = useContext(Context);
  const navigate = useNavigateToEncodedURL();

  const [minPriceValue, setMinPriceValue] = useState(deviceStore.initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState(deviceStore.initialMaxPrice);

  const [isValid, setIsValid] = useState(true);

  useResettingMinMaxPrices(
    deviceStore.initialMinPrice, deviceStore.initialMaxPrice,
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
      || (minPriceValue === deviceStore.initialMinPrice && maxPriceValue === deviceStore.initialMaxPrice)) return;

    const nextUrl = URLActions.setNewParam("price", `${minPriceValue}-${maxPriceValue}`);
    const basename = process.env.REACT_APP_CLIENT_URL;
    navigate(nextUrl.replaceAll(basename, ""));
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
