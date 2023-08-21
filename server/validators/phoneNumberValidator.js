const ApiError = require('../exceptions/api-error');
const { isValidPhoneNumber } = require('libphonenumber-js');

module.exports = (value) => {
  const isValid = isValidPhoneNumber(value);
  if (!isValid) {
    throw ApiError.BadRequest("The phone number isn't valid");
  }

  return true;
}