import DeviceSalesActions from "../utils/DeviceSalesActions";
import { DEVICE_API_URL } from "../utils/consts";
import findMinMaxPrices from "../utils/findMinMaxPrices";
import getDiscountedPrice from "../utils/getDiscountedPrice";
import { $mockApi } from "./index";

export async function getDevices(stringQueryParams = "") {
  const res = await $mockApi.get(`${DEVICE_API_URL}&${stringQueryParams}`);
  const totalCount = res.headers["x-total-count"];
  return { devices: res.data, totalCount: totalCount };
}

export async function getDeviceMinMaxPrices(stringQueryParams = "", sales = [], saleTypeNames = []) {
  const { data } = await $mockApi.get(`${DEVICE_API_URL}&${stringQueryParams}`);
  let prices = [];

  for (let dev of data) {
    const { discountPercentage } = DeviceSalesActions.getSaleTypesAndDiscount(dev, sales, saleTypeNames);
    
    for (let combo of dev["device-combinations"]) {
      let price;
      if (discountPercentage) {
        price = getDiscountedPrice(combo.price, discountPercentage);
      } else {
        price = combo.price;
      }

      prices.push(price);
    }
  }

  const { minPrice, maxPrice } = findMinMaxPrices(prices);
  return { minPrice, maxPrice };
}