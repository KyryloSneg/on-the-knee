import { useContext } from "react";
import "./styles/MinMaxPrice.css";
import { Context } from "../Context";
import validateMinMaxPrice from "../utils/validateMinMaxPrice";

const MinMaxPrice = ({ variant, value, setValue, isValid, setIsValid, minPriceValue, maxPriceValue }) => {
  const { deviceStore } = useContext(Context);
  const isMin = variant === "min";

  const inputIdName = isMin ? "min-price" : "max-price";  
  const labelText = isMin ? "Min Price" : "Max price";
  const testId = isMin ? "price-category-min" : "price-category-max" ;

  function onChange(e) {
    let nextValue = "0";

    // some operation with "0" in the inputs
    if (e.target.value === "") {
      nextValue = "0";
    } else if (value === "0" && e.target.value.match(/0[1-9]/)) {
      nextValue = e.target.value[1];
    } else {
      nextValue = e.target.value;
    }

    validateMinMaxPrice(
      setIsValid, 
      isMin, 
      nextValue, 
      deviceStore.initialMinPrice, 
      deviceStore.initialMaxPrice, 
      minPriceValue, 
      maxPriceValue
    );
    setValue(nextValue)
  }

  return (
    <div className="min-max-price-wrap">
      <label htmlFor={inputIdName}>{labelText}</label>
      <input
        type="number"
        name={inputIdName}
        className={!isValid ? "invalidInput" : ""}
        id={inputIdName}
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  );
};

export default MinMaxPrice;
