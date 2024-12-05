const { faker } = require("@faker-js/faker");

module.exports = (deviceId, devices, additionalServices, additionalServiceDevices, deviceCombinations) => {
  const hasAdditionalServices = devices.length > 0 ? faker.datatype.boolean(0.5) : false;
  if (!hasAdditionalServices) return;

  const servicesAmount = faker.number.int({ min: 1, max: 3 });
  
  for (let i = 0; i < servicesAmount; i++) {
    const randomDevice = devices[faker.number.int({ min: 0, max: devices.length - 1 })];

    let names = [];
    const devCombos = deviceCombinations.filter(combo => combo.deviceId === randomDevice.id);
  
    const baseName = faker.commerce.productName();
    for (let i = 0; i < devCombos.length; i++) {
      const name = `${baseName} ${i + 1}`;
      names.push(name);
    }
  
    const additionalService = {
      "id": faker.string.uuid(),
      "deviceId": randomDevice.id,
      "names": names,
    };
  
    const additionalServiceDevice = {
      "id": faker.string.uuid(),
      "deviceId": deviceId,
      "name": randomDevice.name,
      "additional-serviceId": additionalService.id
    }

    additionalServices.push(additionalService);
    additionalServiceDevices.push(additionalServiceDevice);
  }

}