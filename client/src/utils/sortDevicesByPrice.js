import DeviceComboActions from "./DeviceComboActions";
import compareNumbers from "./compareNumbers";
import { getDiscountedPriceOrDefaultOne } from "./getDiscountedPrice";

function sortDevicesByPrice(devices, stocks, sales, saleTypeNames, hasTriedToFetchSales, toReverse) {
  devices.sort((firstDev, secondDev) => {
    const { defaultCombinationInStock: firstDefaultCombo } = DeviceComboActions.findDefaultCombination(firstDev, stocks); 
    const { defaultCombinationInStock: secondDefaultCombo } = DeviceComboActions.findDefaultCombination(secondDev, stocks); 

    const firstComboPrice = +getDiscountedPriceOrDefaultOne(
      firstDefaultCombo, firstDev, sales, saleTypeNames, hasTriedToFetchSales
    );
    
    const secondComboPrice = +getDiscountedPriceOrDefaultOne(
      secondDefaultCombo, secondDev, sales, saleTypeNames, hasTriedToFetchSales
    );

    return compareNumbers(firstComboPrice, secondComboPrice);
  })

  if (toReverse) {
    devices.reverse();
  }
}

export default sortDevicesByPrice;