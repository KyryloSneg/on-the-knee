import { useContext } from "react";
import "./styles/MinMaxPrice.css";
import { Context } from "../Context";
import priceFilterOnKeyDown from "../utils/priceFilterOnKeyDown";
import validateMinMaxPrice from "../utils/validateMinMaxPrice";

const MinMaxPrice = ({ variant, value, setValue, isValid, setIsValid, minPriceValue, maxPriceValue }) => {
  const { deviceStore } = useContext(Context);
  const isMin = variant === "min";

  const inputIdName = isMin ? "min-price" : "max-price";
  const labelText = isMin ? "Min Price" : "Max price";
  const testId = isMin ? "price-category-min" : "price-category-max";

  function onChange(e) {
    let nextValue = e.target.value;
    
    const nextIsValid = validateMinMaxPrice(
      isMin,
      nextValue,
      deviceStore.initialMinPrice,
      deviceStore.initialMaxPrice,
      minPriceValue,
      maxPriceValue
    );

    setIsValid(nextIsValid);
    setValue(nextValue);
  }

  return (
    <div className="min-max-price-wrap">
      <label htmlFor={inputIdName}>{labelText}</label>
      <input
        type="text"
        name={inputIdName}
        className={!isValid ? "invalidInput" : ""}
        id={inputIdName}
        value={value}
        onChange={onChange}
        onKeyDown={(e) =>
          priceFilterOnKeyDown(e, value, isMin, deviceStore.initialMinPrice, deviceStore.initialMaxPrice,
            minPriceValue, maxPriceValue, setIsValid, setValue)
        }
        data-testid={testId}
      />
    </div>
  );
};

export default MinMaxPrice;
