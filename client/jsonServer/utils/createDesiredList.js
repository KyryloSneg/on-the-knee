const { faker } = require("@faker-js/faker");
const { USER_IDS } = require("./consts");
const createDesiredListDevices = require("./createDesiredListDevices");

module.exports = (devices) => {
  let desiredLists = [];
  let desiredListDevices = [];

  for (let id of USER_IDS) { // TODO: change USER_IDS to USERS in future
    const desiredList = {
      "id": faker.string.uuid(),
      "userId": id,
    };

    createDesiredListDevices(desiredListDevices, desiredList.id, devices);
    desiredLists.push(desiredList);
  } 

  return {
    desiredLists,
    desiredListDevices,
  };
}