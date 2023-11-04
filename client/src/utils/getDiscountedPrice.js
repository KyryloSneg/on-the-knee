function getDiscountedPrice(price, discountPercentage) {
  let discountedPrice = price * ((100 - discountPercentage) / 100);
  discountedPrice = discountedPrice.toFixed(2);

  return discountedPrice;
}

export default getDiscountedPrice;