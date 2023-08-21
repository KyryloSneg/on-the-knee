const { faker } = require("@faker-js/faker");

module.exports = (combinations, orderId, devices, deviceCombinations) => {
  let currOrderCombo = [];
  let additionalInfo = { sum: 0, names: [], amount: 0 };

  const combinationAmount = faker.number.int({ min: 1, max: 8 });
  for (let i = 0; i < combinationAmount; i++) {
    const deviceCombo = deviceCombinations[faker.number.int({ min: 0, max: deviceCombinations.length - 1 })];
    const deviceName = devices[deviceCombo.deviceId - 1].name;
    const amount = faker.number.int({ min: 1, max: 3 })
    
    const orderDeviceCombination = {
      "id": combinations.length + 1,
      "orderId": orderId,
      "device-combinationId": deviceCombo.id,
      "amount": amount,
    }

    currOrderCombo.push(orderDeviceCombination);
    combinations.push(orderDeviceCombination);

    additionalInfo.sum += Number(deviceCombo.price);
    additionalInfo.names.push(deviceName);
    additionalInfo.amount += amount;
  }

  additionalInfo.sum = additionalInfo.sum.toFixed(2);
  return { currOrderCombo, additionalInfo };
}