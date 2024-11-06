const { faker } = require("@faker-js/faker");
const { USERS } = require("./consts");
const createViewedDevices = require("./createViewedDevices");

module.exports = (devices, deviceCombinations) => {
  let viewedDevicesLists = [];
  let viewedDevices = [];

  for (let user of USERS) {
    const viewedDevicesList = {
      "id": faker.string.uuid(),
      "userId": user._id,
    };

    createViewedDevices(viewedDevices, viewedDevicesList.id, devices, deviceCombinations);
    viewedDevicesLists.push(viewedDevicesList);
  } 

  return {
    viewedDevicesLists,
    viewedDevices,
  };
}