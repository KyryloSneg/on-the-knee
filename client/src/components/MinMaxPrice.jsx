import { forwardRef, useContext } from "react";
import "./styles/MinMaxPrice.css";
import { Context } from "../Context";

const MinMaxPrice = forwardRef(({ variant, value, setValue, isValid, setIsValid, minPriceValue, maxPriceValue }, ref) => {
  const { deviceStore } = useContext(Context);
  const isMin = variant === "min";

  const inputIdName = isMin ? "min-price" : "max-price";  
  const labelText = isMin ? "Min Price" : "Max price";
  const testId = isMin ? "price-category-min" : "price-category-max" ;

  function onChange(e) {
    let nextValue = "0";

    // first condition || ( e.target.value === "00" && value === "0" )
    if (e.target.value === "") {
      nextValue = "0";
    } else if (value === "0" && e.target.value.match(/0[1-9]/)) {
      nextValue = e.target.value[1];
    } else {
      nextValue = e.target.value;
    }

    function validate() {
      let nextIsValid;

      if (isMin && (+nextValue < deviceStore.initialMinPrice || maxPriceValue > deviceStore.initialMaxPrice)) {
        nextIsValid = false;
      } else if (!isMin && (+nextValue > deviceStore.initialMaxPrice || minPriceValue < deviceStore.initialMinPrice)) {
        nextIsValid = false;
      } else if (isMin && +nextValue > +maxPriceValue) {
        nextIsValid = false;
      } else if (!isMin && +nextValue < +minPriceValue) {
        nextIsValid = false;
      } else if (!isMin && nextValue[0] === "0") {
        nextIsValid = false;
      } else {
        nextIsValid = true;
      }

      setIsValid(nextIsValid);
    }

    validate();
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
        ref={ref || null}
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  );
});

export default MinMaxPrice;
