const ApiError = require('../exceptions/api-error');

module.exports = (value, { req }) => {
  // password must be from 8 to 512 symbols in length, not equal to an email and contains:
  // - at least 2 digits
  // - at least 1 lowercase latin letter
  // - at least 1 uppercase latin letter
  // - at least 1 special symbol (regex' Symbol and Punctuation 
  // from the table https://unicode.org/reports/tr18/#General_Category_Property)
  const equalsToEmail = value === req.body.email;
  if (equalsToEmail) {
    throw ApiError.BadRequest("Password must not equal to an email");
  }

  // const passwordMatch = value.match(/^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[.?!@#$%])(?=.*[0-9a-zA-Z!@#$%]).{8,}$/gm);
  const passwordMatch = /^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9a-zA-Z]).{8,512}$/gm.test(value) 
    && /\p{S}|\p{P}/gu.test(value);

  if (!passwordMatch) {
    throw ApiError.BadRequest(`Password must be from 8 to 512 symbols in length and contains: at least 2 digits, at least 1 lowercase latin letter, at least 1 uppercase latin letter, at least 1 special symbol`);
  }

  return true;
}