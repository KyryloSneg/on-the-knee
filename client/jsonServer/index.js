const createDevices = require("./utils/createDevices");
const createUsers = require("./utils/createUsers");

module.exports = () => {
  const data = {
    "users": [],
    "carts": [], 
    "cartDevices": [/* {id, cartId, deviceId} */], // will be empty
    "favorites": [], 
    "favoriteDevices": [/* {id, favoritesId, deviceId} */], // will be empty
    "comparison": [], 
    "comparisonDevices": [/* {id, comparisonId, deviceId} */], // will be empty
    "devices": [],
    "deviceInfos": [],
    "ratings": [],
    "colors": [],
    "brands": [],
    "categories": []
  }

  const { users, carts, favorites, comparison } = createUsers();

  createDevices()
    .then(returnData => {
      data.users = users;
      data.carts = carts;
      data.favorites = favorites;
      data.comparison = comparison;

      data.devices = returnData.devices;
      data.deviceInfos = returnData.infos;
      data.ratings = returnData.ratings;
      data.colors = returnData.colors;
      data.brands = returnData.brands;
      data.categories = returnData.categories
    });

  return data;
}