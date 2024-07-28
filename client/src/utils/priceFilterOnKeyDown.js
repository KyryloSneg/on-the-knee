import validateMinMaxPrice from "./validateMinMaxPrice";
import validateNumberInput from "./validateNumberInput";

function priceFilterOnKeyDown(
  e, type, value, setValue, setIsValid, minValue = 0,
  onSetValueCb = null, isMin = null, 
  initialMinPrice = null, initialMaxPrice = null, 
  minPriceValue = null, maxPriceValue = null
) {
  let nextValue;

  let changeNumber = 1;
  if (e.shiftKey) changeNumber = 10;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();

      // do not handle adding / substracting value if it is not a number
      if (isNaN(+value)) break;
      if (+value - changeNumber > minValue) {
        nextValue = +value - changeNumber;
      } else {
        nextValue = minValue;
      }
      
      break;
    case "ArrowUp":
      e.preventDefault();
      nextValue = +value + changeNumber;

      break;
    default:
      break;
  }

  if (!nextValue && nextValue !== 0) return;

  let nextIsValid;
  if (type === "price") {
    nextIsValid = validateMinMaxPrice(
      isMin,
      nextValue,
      initialMinPrice,
      initialMaxPrice,
      minPriceValue,
      maxPriceValue
    ).nextIsValid;

    setValue(`${nextValue.toFixed(2)}`);
  } else if (type === "default") {
    nextIsValid = validateNumberInput(nextValue, minValue);
    setValue(nextValue);
  }

  setIsValid(nextIsValid);
  if (onSetValueCb) onSetValueCb();
}

export default priceFilterOnKeyDown;