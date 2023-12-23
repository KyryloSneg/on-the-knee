function findMinMaxPrices(prices) {
  let minPrice = null;
  let maxPrice = null;

  for (let price of prices) {
    if (+price < minPrice || minPrice === null) {
      minPrice = +price;
    } 
    if (+price > maxPrice || maxPrice === null) {
      maxPrice = +price;
    }
  }

  return { minPrice, maxPrice };
}

export default findMinMaxPrices;