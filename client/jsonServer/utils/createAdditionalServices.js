const { faker } = require("@faker-js/faker");

module.exports = (deviceId, devices, additionalServices, additionalServiceDevices) => {
  const hasAdditionalServices = devices.length > 0 ? faker.datatype.boolean(0.5) : false;
  if (!hasAdditionalServices) return;

  const additionalService = {
    "id": additionalServices.length + 1,
    "deviceId": deviceId,
    "name": faker.commerce.productName(),
  };
  
  const randomDevice = devices[faker.number.int({ min: 0, max: devices.length - 1 })];
  const additionalServiceDevice = {
    "id": additionalServiceDevices.length + 1,
    "deviceId": randomDevice.id,
    "name": randomDevice.name,
    "additionalServiceId": additionalService.id
  }

  additionalServices.push(additionalService);
  additionalServiceDevices.push(additionalServiceDevice);
}