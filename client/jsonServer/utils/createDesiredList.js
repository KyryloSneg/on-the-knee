const { faker } = require("@faker-js/faker");
const { USERS } = require("./consts");
const createDesiredListDevices = require("./createDesiredListDevices");

module.exports = (devices, deviceCombinations) => {
  let desiredLists = [];
  let desiredListDevices = [];

  for (let user of USERS) {
    const desiredList = {
      "id": faker.string.uuid(),
      "userId": user._id,
    };

    createDesiredListDevices(desiredListDevices, desiredList.id, devices, deviceCombinations);
    desiredLists.push(desiredList);
  } 

  return {
    desiredLists,
    desiredListDevices,
  };
}