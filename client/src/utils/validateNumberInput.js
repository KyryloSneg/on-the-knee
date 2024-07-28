export default function validateNumberInput(value, minValue) {
  const isValid = !isNaN(+value) && +value >= minValue;
  return isValid;
}