const createDevices = require("./utils/createDevices");

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

    "store-locations": [],
    "courier-schedules": [],

    "receivents": [],
    "device-feedbacks": [],
    "device-feedback-replies": [],

    "orders": [],
    "order-device-combinations": [],
  };

  createDevices().then(result => {
    console.log("finished");

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
  });
  
  return data;
}