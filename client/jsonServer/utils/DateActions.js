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

}