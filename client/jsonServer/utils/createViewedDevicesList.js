const { faker } = require("@faker-js/faker");
const createViewedDevices = require("./createViewedDevices");

module.exports = (devices, deviceCombinations) => {
  let viewedDevicesLists = [];
  let viewedDevices = [];

  // USERS
  for (let user of []) {
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