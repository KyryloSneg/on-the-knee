const { faker } = require("@faker-js/faker");
const { POSSIBLE_DELIVERY_TYPES } = require("./consts");

module.exports = (cities) => {
  let deliveryTypes = [];
  let deliveries = [];

  let selfDeliveryCities = [];
  let courierCities = [];

  for (let [name, price] of Object.entries(POSSIBLE_DELIVERY_TYPES)) {
    const delType = {
      "id": deliveryTypes.length + 1,
      "name": name,
      "price": price,
    }

    deliveryTypes.push(delType);
  }

  for (let city of cities) {
    let cityDelTypeIds = [];
    let deliveryTypesCopy = [...deliveryTypes]; 

    for (let i = 0 ; i < deliveryTypes.length; i++) {
      const randomType = deliveryTypesCopy[faker.number.int({ min: 0, max: deliveryTypesCopy.length - 1 })];
      
      if (randomType.name === "self-delivery") {
        selfDeliveryCities.push(city);
      } else if (randomType.name === "courier") {
        courierCities.push(city);
      }

      deliveryTypesCopy = deliveryTypesCopy.filter(t => t.id !== randomType.id);
      cityDelTypeIds.push(randomType.id);

      const toFinish = faker.datatype.boolean(0.5);
      if (toFinish) break;
    }

    for (let typeId of cityDelTypeIds) {
      const isPrice = deliveryTypes[typeId - 1].name !== "self-delivery";
      let price = isPrice ? faker.number.int({ min: 3, max: 10 }) : null;

      if (price) {
        price = price != 0 ? price.toFixed(2) : 0;
      }

      const delivery = {
        "id": deliveries.length + 1,
        "delivery-typeId": typeId,
        "price": price,
        "cityId": city.id,
      }

      deliveries.push(delivery);
    }
    
  }

  return {
    deliveryTypes,
    deliveries,
    selfDeliveryCities,
    courierCities,
  }
}