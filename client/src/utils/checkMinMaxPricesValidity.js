import URLActions from "./URLActions";
import validateMinMaxPrice from "./validateMinMaxPrice";

export default function checkMinMaxPricesValidity(initialMinPrice, initialMaxPrice) {
  if (!initialMinPrice || !initialMaxPrice) return;

  const [queryMinPrice, queryMaxPrice] = URLActions.getParamValue("price")?.split("-") || [];
  if (queryMinPrice === undefined || queryMaxPrice === undefined) return;

  const { 
    nextIsValid: isValidQueryMinPrice, 
    isChangedInitPrice: isChangedMinInitPrice 
  } = validateMinMaxPrice(
    true,
    queryMinPrice,
    initialMinPrice,
    initialMaxPrice,
    queryMinPrice,
    queryMaxPrice
  );

  const { 
    nextIsValid: isValidQueryMaxPrice, 
    isChangedInitPrice: isChangedMaxInitPrice 
  } = validateMinMaxPrice(
    false,
    queryMaxPrice,
    initialMinPrice,
    initialMaxPrice,
    queryMinPrice,
    queryMaxPrice
  );

  return {
    isValidQueryMinPrice,
    isValidQueryMaxPrice,
    isChangedMinInitPrice,
    isChangedMaxInitPrice,
  }
}