const { faker } = require("@faker-js/faker");
const { POSSIBLE_DEVICE_INFOS } = require("./consts");
const StringActions = require("./StringActions");

module.exports = (deviceId, categorySlug, deviceInfos, attributeNames) => {
  const possibleDeviceInfos = POSSIBLE_DEVICE_INFOS[categorySlug];
  
  if (possibleDeviceInfos) {
    const deviceInfosIndex = faker.number.int({ min: 0, max: possibleDeviceInfos.length - 1 });
    for (let [name, value] of Object.entries(possibleDeviceInfos[deviceInfosIndex])) {
      if (attributeNames.includes(name)) continue;

      const info = {
        "id": deviceInfos.length + 1,
        "deviceId": deviceId,
        "name": name,
        "value": StringActions.capitalize(value),
      }

      deviceInfos.push(info);
    }
  } else {
    // if there's no info for a device, we create only "material" one by default 
    const info = {
      "id": deviceInfos.length + 1,
      "deviceId": deviceId,
      "name": "material",
      "value": faker.commerce.productMaterial(),
    }

    deviceInfos.push(info);
  }
}