const { faker } = require("@faker-js/faker")

module.exports = (viewedDevices, viewedDevicesListId, devices, deviceCombinations) => {

  for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
    const device = devices[faker.number.int({ min: 0, max: devices.length - 1 })];
    const thisDeviceCombos = deviceCombinations.filter(combo => combo.deviceId === device.id);

    const viewedDevice = {
      "id": faker.string.uuid(),
      "viewed-devices-listId": viewedDevicesListId,
      "deviceId": device.id,
      "device-combinationId": thisDeviceCombos[faker.number.int({ min: 0, max: thisDeviceCombos.length - 1 })].id,
      "date": new Date()
    }

    viewedDevices.push(viewedDevice);
  }
  
}