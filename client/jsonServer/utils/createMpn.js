const { faker } = require('@faker-js/faker');

module.exports = (baseMpn) => {
  return `${baseMpn}-${faker.number.int({min: 100000, max: 999999})}`;
}