const { faker } = require('@faker-js/faker');

module.exports = () => {
  return faker.number.int({min: 100000000, max: 999999999})
}