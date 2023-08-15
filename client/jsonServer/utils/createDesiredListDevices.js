const { faker } = require("@faker-js/faker")

module.exports = (desiredListDevices, desiredListId, devices) => {

  for (let i = 0; i < faker.number.int({ min: 0, max: 10 }); i++) {
    const desiredListDevice = {
      "id": desiredListDevices.length + 1,
      "desired-listId": desiredListId,
      "deviceId": faker.number.int({ min: 0, max: devices.length - 1 }),
    }

    desiredListDevices.push(desiredListDevice);
  }
  
}