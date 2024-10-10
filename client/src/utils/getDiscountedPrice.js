import DeviceSalesActions from "./DeviceSalesActions";

export function getDiscountedPrice(price, discountPercentage) {
  let discountedPrice = price * ((100 - discountPercentage) / 100);
  discountedPrice = discountedPrice.toFixed(2);

  return discountedPrice;
}

export function getDiscountedPriceOrDefaultOne(combination, device, sales, saleTypeNames, hasTriedToFetchSales) {
  const { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(device, sales, saleTypeNames, hasTriedToFetchSales);

  let discountedPrice;
  if (discountPercentage) {
    discountedPrice = +getDiscountedPrice(combination.price, discountPercentage);
  }

  return discountedPrice || +combination.price;
}