import filterDeviceCombosWithFilters from "./filterDeviceCombosWithFilters";
import { getDiscountedPriceOrDefaultOne } from "./getDiscountedPrice";

export function filterDevicesByStock(devices, stocks, usedFilters) {
  // cloning filteredDevices array to prevent bugs
  // that can be possibly caused by changing it inside the loop

  const filteredDevices = filterDeviceCombosWithFilters(
    item => {
      const stock = stocks.find(s => s["device-combinationId"] === item.id);
      return usedFilters["stock"]?.includes(stock.stockStatus);
    },
    [...devices],
  );

  return filteredDevices
}

export function filterDevicesByPrice(devices, sales, saleTypeNames, minQueryPrice, maxQueryPrice) {
  const filteredDevices = filterDeviceCombosWithFilters(
    (item, dev) => {
      const priceToCompare = getDiscountedPriceOrDefaultOne(item, dev, sales, saleTypeNames)
      return (priceToCompare >= minQueryPrice && priceToCompare <= maxQueryPrice)
    },
    [...devices],
  );

  return filteredDevices;
}

export function filterDevicesBySellers(devices, sellers, usedFilters) {
  const filteredDevices = [...devices].filter(dev => {
    const seller = sellers.find(s => s.id === dev.sellerId);
    return usedFilters["seller"]?.includes(seller.name);
  });

  return filteredDevices;
}

export function filterDevicesByBrands(devices, brands, usedFilters) {
  const filteredDevices = [...devices].filter(dev => {
    const brand = brands.find(b => b.id === dev.brandId);
    return usedFilters["brand"]?.includes(brand.name);
  });

  return filteredDevices;
}