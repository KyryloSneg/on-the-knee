const { faker } = require("@faker-js/faker");
const { POSSIBLE_SCHEDULE_TIME_RANGES } = require("./consts");
const DateActions = require("./DateActions");

module.exports = (deliveries, deliveryTypes) => {
  let schedules = [];

  const startDate = new Date();
  for (let delivery of deliveries) {
    const delType = deliveryTypes.find(deliveryType => deliveryType.id === delivery["delivery-typeId"]);
    if (delType.name !== "courier") continue; 
    
    const shiftAmount = faker.datatype.boolean(0.5) ? 2 : 4;

    const weekendAmount = 2;
    let workDays = [1, 2, 3, 4, 5, 6, 7];
    
    for (let j = 0; j < weekendAmount; j++) { // creating end array of work days
      let weekendIndex = faker.number.int({ min: 0, max: workDays.length - 1 });
      workDays = workDays.filter(d => d !== workDays[weekendIndex]);
    }

    let timeRanges = POSSIBLE_SCHEDULE_TIME_RANGES[shiftAmount];
    timeRanges = timeRanges[faker.number.int({ min: 0, max: timeRanges.length - 1 })];

    for (let workDay of workDays) {
      const date = new Date(startDate.getTime());
      date.setDate(date.getDate() + (workDay - 1));
      date.setHours(0); // creating "fancy" date isn't necessary but i leave it
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      let shifts = {}; 
      for (let shift = 1; shift <= shiftAmount; shift++) { // making time ranges per shift
        const range = timeRanges[shift];
        const parsedRange = DateActions.parseTimeRange(range);

        const startTime = new Date(date.getTime());
        DateActions.setParsedTime(startTime, parsedRange.start);

        const endTime = new Date(date.getTime());
        DateActions.setParsedTime(endTime, parsedRange.end);

        shifts[shift] = { startTime, endTime };
      }

      const schedule = {
        "id": schedules.length + 1,
        "deliveryId": delivery.id,
        "date": date,
        "shifts": shifts,
      }

      schedules.push(schedule);
    }
  }

  return schedules;

}