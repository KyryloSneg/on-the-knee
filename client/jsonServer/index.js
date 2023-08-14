const createCourierSchedules = require("./utils/createCourierSchedules");
const createDeliveries = require("./utils/createDeliveries");
const createDevices = require("./utils/createDevices");
const createLocations = require("./utils/createLocations");
const initializeEnvVars = require("./utils/initializeJsonServerEnvVars");

module.exports = function createData () {
  const data = {
    "devices": [],
    "device-combinations": [],
    "stocks": [],

    "attributes": [],
    "attribute-names": [],
    "attribute-values": [],

    "sales": [],
    "sale-devices": [],
    "sale-types": [],
    "sale-type-names": [],

    "categories": [],
    "brands": [],
    "device-infos": [],
    "payment-infos": [],

    "additional-services": [],
    "additional-service-devices": [],

    "sellers": [],
    "seller-feedbacks": [],
    "seller-feedback-replies": [],

    "carts": [],
    "cart-devices": [],

    "desired-lists": [],
    "desired-devices": [],

    "countries": [],
    "regions": [],
    "districts": [],
    "cities": [],
    "streets": [],

    "store-pickup-points": [],
    "courier-schedules": [],

    "receivents": [],
    "device-feedbacks": [],
    "device-feedback-replies": [],

    "orders": [],
    "order-device-combinations": [],

    "deliveries": [],
    "delivery-types": [],
  };

  initializeEnvVars();
  
  createLocations().then(result => {
    data["countries"] = result.countries;
    data["regions"] = result.regions;
    data["districts"] = result.districts;
    data["cities"] = result.cities;
    data["streets"] = result.streets;
    data["store-pickup-points"] = result.storePickupPoints;

    const { deliveryTypes, deliveries, courierCities } = createDeliveries(result.cities);
    data["delivery-types"] = deliveryTypes;
    data["deliveries"] = deliveries;
    data["courier-schedules"] = createCourierSchedules(courierCities);
  });

  createDevices().then(result => {
    data["devices"] = result.devices;
    data["device-feedbacks"] = result.deviceFeedbacks;
    data["device-feedback-replies"] = result.deviceFeedbackReplies;
    data["device-infos"] = result.deviceInfos;
    data["device-combinations"] = result.deviceCombinations;
    
    data["stocks"] = result.stocks;
    
    data["brands"] = result.brands;
    data["categories"] = result.categories;
    
    data["sellers"] = result.sellers;
    data["seller-feedbacks"] = result.sellerFeedbacks;
    data["seller-feedback-replies"] = result.sellerFeedbackReplies;
    
    data["attributes"] = result.attributes;
    data["attribute-names"] = result.attributeNames;
    data["attribute-values"] = result.attributeValues;
    
    data["additional-services"] = result.additionalServices;
    data["additional-service-devices"] = result.additionalServiceDevices;

    data["sales"] = result.sales;
    data["sale-types"] = result.saleTypes;
    data["sale-type-names"] = result.saleTypeNames;
    data["sale-devices"] = result.saleDevices;
    
    console.log("finished");
  });
  
  return data;
}