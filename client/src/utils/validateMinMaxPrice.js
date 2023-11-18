function validateMinMaxPrice(isMin, nextValue, initMinPrice, initMaxPrice, minPriceValue, maxPriceValue) {
  let nextIsValid;

  if (isNaN(+nextValue)) {
    nextIsValid = false;
  } else if (isMin && (+nextValue < initMinPrice || +maxPriceValue > initMaxPrice)) {
    nextIsValid = false;
  } else if (!isMin && (+nextValue > initMaxPrice || +minPriceValue < initMinPrice)) {
    nextIsValid = false;
  } else if (isMin && +nextValue > +maxPriceValue) {
    nextIsValid = false;
  } else if (!isMin && +nextValue < +minPriceValue) {
    nextIsValid = false;
  } else if (nextValue[0] === "0") {
    nextIsValid = false;
  } else {
    nextIsValid = true;
  }

  return nextIsValid;
}

export default validateMinMaxPrice;