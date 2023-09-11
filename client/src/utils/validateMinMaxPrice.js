function validateMinMaxPrice(setIsValid, isMin, nextValue, initMinPrice, initMaxPrice, minPriceValue, maxPriceValue) {
  let nextIsValid;

  if (isMin && (+nextValue < initMinPrice || maxPriceValue > initMaxPrice)) {
    nextIsValid = false;
  } else if (!isMin && (+nextValue > initMaxPrice || minPriceValue < initMinPrice)) {
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

export default validateMinMaxPrice;