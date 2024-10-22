import DeviceComboActions from "./DeviceComboActions";
import compareNumbers from "./compareNumbers";
import { getDiscountedPriceOrDefaultOne } from "./getDiscountedPrice";


// using (areDevsWithCertainDevComboId === true) requires devices to have the "deviceCombinationId" field
function sortDevicesByPrice(
  devices, stocks, sales, saleTypeNames, hasTriedToFetchSales, 
  toReverse = false, areDevsWithCertainDevComboId = false
) {
  devices.sort((firstDev, secondDev) => {
    let firstDefaultCombo;
    let secondDefaultCombo;

    if (areDevsWithCertainDevComboId) {
      firstDefaultCombo = firstDev["device-combinations"].find(combo => combo.id === firstDev.deviceCombinationId);
      secondDefaultCombo = secondDev["device-combinations"].find(combo => combo.id === secondDev.deviceCombinationId);
    } else {
      // defaultCombinationInStock
      const firstResult = DeviceComboActions.findDefaultCombination(firstDev, stocks); 
      const secondResult = DeviceComboActions.findDefaultCombination(secondDev, stocks); 

      firstDefaultCombo = firstResult.defaultCombinationInStock;
      secondDefaultCombo = secondResult.defaultCombinationInStock;
    }

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