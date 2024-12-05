const { faker } = require("@faker-js/faker");
const findSale = require("./findSale");

module.exports = (combinations, cartDeviceCombinations, orderId, devices, deviceCombinations, saleDevices, sales, saleTypes) => {
  let currOrderCombo = [];
  let additionalInfo = { sum: 0, names: [], amount: 0 };

  for (let cartDeviceCombo of cartDeviceCombinations) {
    const deviceCombo = deviceCombinations.find(combo => combo.id === cartDeviceCombo["device-combinationId"]);
    const device = devices.find(dev => dev.id === cartDeviceCombo.deviceId);
    
    const amount = cartDeviceCombo.amount;

    const saleInfo = findSale(device, saleDevices, sales, saleTypes);
    const saleId = saleInfo ? saleInfo.sale.id : null;
    const discountPercentage = saleInfo ? saleInfo.type?.discountPercentage || null : null;
    
    let price = deviceCombo.price;
    
    if (discountPercentage) {
      price -= price * (discountPercentage / 100);
    }
    
    const orderDeviceCombination = {
      "id": faker.string.uuid(),
      "orderId": orderId,
      "saleId": saleId,
      "discountPercentage": discountPercentage,
      "device-combinationId": deviceCombo.id,
      "amount": amount,
    }

    currOrderCombo.push(orderDeviceCombination);
    combinations.push(orderDeviceCombination);

    additionalInfo.sum += Number(price);
    additionalInfo.names.push(device.name);
    additionalInfo.amount += amount;
  }

  additionalInfo.sum = additionalInfo.sum.toFixed(2);
  return { currOrderCombo, additionalInfo };
}