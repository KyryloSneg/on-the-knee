import { forwardRef, useContext, useState } from "react";
import "./styles/PriceCategoryFilter.css";
import MinMaxPrice from "./MinMaxPrice";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const PriceCategoryFilter = observer(forwardRef(({ className, minPriceRef }, ref) => {
  const { deviceStore } = useContext(Context);

  const [minPriceValue, setMinPriceValue] = useState(deviceStore.initialMinPrice);
  const [maxPriceValue, setMaxPriceValue] = useState(deviceStore.initialMaxPrice);
  const [isValid, setIsValid] = useState(true)


  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const nextUsedFilters = {
      ...deviceStore.usedFilters,
      priceRange: [`Price: ${minPriceValue}-${maxPriceValue}`]
    }

    deviceStore.setUsedFilters(nextUsedFilters);

    // we can set initialMin / Max prices after setting devices
  }

  return (
    <div className={className} ref={ref}>
      <form className="price-range-filter-wrap" onSubmit={onSubmit}>
        <div>
          <MinMaxPrice 
            variant={"min"} 
            ref={minPriceRef}
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

        <button type="submit" disabled={!isValid} data-testid="price-category-filter-btn">OK</button>
      </form>
    </div>
  );
}));

export default PriceCategoryFilter;
