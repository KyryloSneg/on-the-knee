import DeviceComboActions from "./DeviceComboActions";
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

export function filterDevicesByPrice(devices, sales, saleTypeNames, hasTriedToFetchSales, minQueryPrice, maxQueryPrice) {
  const filteredDevices = filterDeviceCombosWithFilters(
    (item, dev) => {
      const priceToCompare = getDiscountedPriceOrDefaultOne(item, dev, sales, saleTypeNames, hasTriedToFetchSales)
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

export function filterDevicesByOneSeller(devices, sellers, sellerToFilterBy) {
  const filteredDevices = [...devices].filter(dev => {
    const devSeller = sellers.find(s => s.id === dev.sellerId);
    return sellerToFilterBy.name === devSeller.name;
  });

  return filteredDevices;
}

export function filterDevicesByBrands(devices, brands, usedFilters) {
  const filteredDevices = [...devices].filter(dev => {
    const brand = brands.find(b => b.id === dev.brandId);

    if (brand) {
      return usedFilters["brand"]?.includes(brand.name);
    } else {
      return false;
    }
  });

  return filteredDevices;
}

export function filterDevicesBySpecialFilters(
  devices, stocks = null, sellers = null, brands = null, sales = null, 
  saleTypeNames = null, minQueryPrice = null, maxQueryPrice = null, usedFilters = null
) {
  const toFilterByPrice = minQueryPrice && maxQueryPrice;
  const toFilterByStock = !!usedFilters["stock"]?.length;
  const toFilterBySellers = !!usedFilters["seller"]?.length;
  const toFilterByBrand = !!usedFilters["brand"]?.length;

  // TODO: add there other "special" filters (that requires separate implementation) later on
  const isSpecialFilters = toFilterByPrice || toFilterByStock || toFilterBySellers || toFilterByBrand;

  if (toFilterByStock) {
    devices = filterDevicesByStock(devices, stocks, usedFilters);
  }

  if (toFilterBySellers) {
    devices = filterDevicesBySellers(devices, sellers, usedFilters);
  }

  if (toFilterByBrand) {
    devices = filterDevicesByBrands(devices, brands, usedFilters);
  }

  let minPrice;
  let maxPrice;

  if (sales && saleTypeNames) {
    // finding min / max prices before filtering by device's cost
    const priceInfo = DeviceComboActions.getDeviceMinMaxPrices(
      devices, sales, saleTypeNames, true
    );

    minPrice = priceInfo.minPrice;
    maxPrice = priceInfo.maxPrice;
  }
  
  if (toFilterByPrice) {
    devices = filterDevicesByPrice(
      devices, sales, saleTypeNames, true, minQueryPrice, maxQueryPrice
    );
  }

  return { devices, minPrice, maxPrice, isSpecialFilters };
}