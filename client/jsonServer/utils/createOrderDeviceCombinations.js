const { faker } = require("@faker-js/faker");
const findSale = require("./findSale");

module.exports = (combinations, orderId, devices, deviceCombinations, saleDevices, sales, saleTypes) => {
  let currOrderCombo = [];
  let additionalInfo = { sum: 0, names: [], amount: 0 };

  const combinationAmount = faker.number.int({ min: 1, max: 8 });
  for (let i = 0; i < combinationAmount; i++) {
    const deviceCombo = deviceCombinations[faker.number.int({ min: 0, max: deviceCombinations.length - 1 })];
    const device = devices[deviceCombo.deviceId - 1];
    const amount = faker.number.int({ min: 1, max: 3 })

    const saleInfo = findSale(device, saleDevices, sales, saleTypes);
    const saleId = saleInfo ? saleInfo.sale.id : null;
    const discountPercentage = saleInfo ? saleInfo.type.discountPercentage : null;
    
    let price = deviceCombo.price;
    if (discountPercentage) {
      price -= price * (discountPercentage / 100);
    }
    
    const orderDeviceCombination = {
      "id": combinations.length + 1,
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