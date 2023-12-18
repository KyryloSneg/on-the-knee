import validateMinMaxPrice from "./validateMinMaxPrice";

function priceFilterOnKeyDown(e, value, isMin, initialMinPrice, initialMaxPrice, minPriceValue, maxPriceValue, setIsValid, setValue) {
  let nextValue;

  let changeNumber = 1;
  if (e.shiftKey) changeNumber = 10;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();

      // do not handle adding / substracting value if it is not a number
      if (isNaN(+value)) break;
      if (+value - changeNumber > 0) {
        nextValue = +value - changeNumber;
      } else {
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
  const { nextIsValid } = validateMinMaxPrice(
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