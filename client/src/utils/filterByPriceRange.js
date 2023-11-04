function filterByPriceRange(items, minPrice, maxPrice) {
  // "item" is an object with field "price"
  const filteredItems = items.filter(item => 
    (item.price >= minPrice && item.price <= maxPrice)
  );
  return filteredItems;
}

export default filterByPriceRange;