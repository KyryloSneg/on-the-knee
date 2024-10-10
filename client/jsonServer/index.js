const createCarts = require("./utils/createCarts");
const createCourierSchedules = require("./utils/createCourierSchedules");
const createDeliveries = require("./utils/createDeliveries");
const createDesiredList = require("./utils/createDesiredList");
const createDevices = require("./utils/createDevices");
const createLocations = require("./utils/createLocations");
const createOrders = require("./utils/createOrders");
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

    "additional-services": [],
    "additional-service-devices": [],

    "sellers": [],
    "seller-feedbacks": [],
    "seller-questions": [],

    "carts": [],
    "cart-device-combinations": [],
    "cart-selected-additional-services": [],

    "desired-lists": [],
    "desired-list-devices": [],

    "countries": [],
    "regions": [],
    "districts": [],
    "cities": [],
    "streets": [],

    "store-pickup-points": [],
    "courier-schedules": [],

    "receivents": [],
    "device-feedbacks": [],
    "device-feedback-likes": [],
    "device-feedback-dislikes": [],
    "device-feedback-replies": [],
    
    "device-questions": [],
    "device-question-likes": [],
    "device-question-dislikes": [],
    "device-answers": [],

    "orders": [],
    "order-courier-deliveries": [],
    "order-device-combinations": [],
    "order-selected-additional-services": [],

    "deliveries": [],
    "delivery-types": [],

    "hint-search-results": [],
  };

  initializeEnvVars();
  
  const locationsPromise = createLocations().then(result => {
    data["countries"] = result.countries;
    data["regions"] = result.regions;
    data["districts"] = result.districts;
    data["cities"] = result.cities;
    data["streets"] = result.streets;
    data["store-pickup-points"] = result.storePickupPoints;

    const { deliveryTypes, deliveries } = createDeliveries(result.cities);
    data["delivery-types"] = deliveryTypes;
    data["deliveries"] = deliveries;
    data["courier-schedules"] = createCourierSchedules(deliveries, deliveryTypes);
  });

  const devicesPromise = createDevices().then(result => {
    data["devices"] = result.devices;
    data["device-feedbacks"] = result.deviceFeedbacks;
    data["device-feedback-likes"] = result.deviceFeedbackLikes;
    data["device-feedback-dislikes"] = result.deviceFeedbackDislikes;
    data["device-feedback-replies"] = result.deviceFeedbackReplies;
    data["device-questions"] = result.deviceQuestions;
    data["device-question-likes"] = result.deviceQuestionLikes;
    data["device-question-dislikes"] = result.deviceQuestionDislikes;
    data["device-answers"] = result.deviceAnswers;
    data["device-infos"] = result.deviceInfos;
    data["device-combinations"] = result.deviceCombinations;
    
    data["stocks"] = result.stocks;
    
    data["brands"] = result.brands;
    data["categories"] = result.categories;
    
    data["sellers"] = result.sellers;
    data["seller-feedbacks"] = result.sellerFeedbacks;
    data["seller-questions"] = result.sellerQuestions;
    
    data["attributes"] = result.attributes;
    data["attribute-names"] = result.attributeNames;
    data["attribute-values"] = result.attributeValues;
    
    data["additional-services"] = result.additionalServices;
    data["additional-service-devices"] = result.additionalServiceDevices;

    data["sales"] = result.sales;
    data["sale-types"] = result.saleTypes;
    data["sale-type-names"] = result.saleTypeNames;
    data["sale-devices"] = result.saleDevices;

    const { carts, cartDeviceCombos, cartSelectedAdditionalServices } = createCarts(result.deviceCombinations);
    data["carts"] = carts;
    data["cart-device-combinations"] = cartDeviceCombos;
    data["cart-selected-additional-services"] = cartSelectedAdditionalServices;

    const { desiredLists, desiredListDevices } = createDesiredList(result.devices);
    data["desired-lists"] = desiredLists;
    data["desired-list-devices"] = desiredListDevices;
  });
  
  Promise.all([locationsPromise, devicesPromise]).then(() => {
    const orderResult = createOrders(
      data["devices"], data["device-combinations"], data["cart-device-combinations"], 
      data["sellers"], data["deliveries"], 
      data["delivery-types"], data["cities"], data["streets"],
      data["store-pickup-points"], data["courier-schedules"],
      data["sale-devices"], data["sales"], data["sale-types"], data["sale-type-names"]
    );

    data["orders"] = orderResult.orders;
    data["order-courier-deliveries"] = orderResult.orderCourierDeliveries;
    data["order-device-combinations"] = orderResult.orderDeviceCombinations;
    data["receivents"] = orderResult.receivents;
    console.log("finished");
  });
  
  return data;
}