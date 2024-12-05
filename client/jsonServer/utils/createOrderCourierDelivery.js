const { faker } = require("@faker-js/faker");

module.exports = (orderCourierDeliveries, courierSchedules, orderId) => {
  let schedule = courierSchedules[faker.number.int({ min: 0, max: courierSchedules.length - 1 })];
  const shifts = Object.keys(schedule.shifts);
  const shiftNumber = shifts[faker.number.int({ min: shifts[0], max: shifts[shifts.length - 1] })]
    
  const orderCourierDelivery = {
    "id": faker.string.uuid(),
    "orderId": orderId,
    "deliveryId": schedule.deliveryId,
    "courier-scheduleId": schedule.id,
    "courier-scheduleShift": shiftNumber,
    "street": faker.location.street(),
    "houseNumber": faker.number.int({ min: 1, max: 300 }),
    "floor": faker.number.int({ min: 1, max: 99 }),
    "flatNumber": faker.number.int({ min: 1, max: 99999 }),
    "isToLiftOnTheFloor": faker.datatype.boolean(0.5),
    "hasElevator": faker.datatype.boolean(0.5),
  };

  orderCourierDeliveries.push(orderCourierDelivery);
  return orderCourierDelivery;
}