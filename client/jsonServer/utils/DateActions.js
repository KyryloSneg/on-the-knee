const { faker } = require("@faker-js/faker");

module.exports = class DateActions {

  static generateRandomHours() {
    const hours = faker.number.int({ min: 0, max: 23 });
    return hours;
  }

  static createExpiresAtDate(daysTerm, hoursTerm) {
    const expiresAt = new Date();
    
    expiresAt.setDate(expiresAt.getDate() + daysTerm);
    expiresAt.setHours(expiresAt.getHours() + hoursTerm);

    return expiresAt;
  }

  static parseTimeRange(timeRange) {
    const [startTime, endTime] = timeRange.split("-");
    const result = {
      "start": {
        "hours": +startTime.split(":")[0],
        "minutes": +startTime.split(":")[1],
      },
      "end": {
        "hours": +endTime.split(":")[0],
        "minutes": +endTime.split(":")[1],
      },
    };

    return result;
  }

  static setParsedTime(date, parsedTime) { // parsedTime contains two fields: hours and minutes
    date.setHours(parsedTime.hours);
    date.setMinutes(parsedTime.minutes);
  }

  static createSimpleDate(hours, minutes, seconds, ms) {
    const date = new Date();
    date.setHours(hours, minutes, seconds, ms);

    return date;
  }

}