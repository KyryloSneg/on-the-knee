const { faker } = require('@faker-js/faker');
const { POSSIBLE_DEVICE_INFOS } = require('./consts');

module.exports = (deviceInfos, deviceCategory, infoId, deviceId) => {
  const possibleDeviceInfos = POSSIBLE_DEVICE_INFOS[deviceCategory];
  if (!possibleDeviceInfos) return [];

  const infos = possibleDeviceInfos[faker.number.int({ min: 0, max: possibleDeviceInfos.length - 1 })];
  let infoItems = [];

  for (let [title, desc] of Object.entries(infos)) {
    infoItems.push({
      "title": title,
      "description": desc
    })
  }

  const info = {
    "id": infoId,
    "deviceId": deviceId,
    "items": infoItems,
  }

  deviceInfos.push(info);

  return info;
}