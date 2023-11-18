import validateMinMaxPrice from "./validateMinMaxPrice";

function priceFilterOnKeyDown(e, value, isMin, initialMinPrice, initialMaxPrice, minPriceValue, maxPriceValue, setIsValid, setValue) {
  let nextValue;

  let changeNumber = 1;
  if (e.shiftKey) changeNumber = 10;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (+value - changeNumber > 0) {
        nextValue = +value - changeNumber;
      } else if (+value - 1 > 0) {
        // if the (value - 10) is less than 0, try (value - 1) else if it passes the condition
        nextValue = +value - 1;
      } else if (+value <= 1) {
        nextValue = 0;
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
  const nextIsValid = validateMinMaxPrice(
    isMin,
    nextValue,
    initialMinPrice,
    initialMaxPrice,
    minPriceValue,
    maxPriceValue
  );

  setIsValid(nextIsValid);
  setValue(`${nextValue.toFixed(2)}`);
}

export default priceFilterOnKeyDown;