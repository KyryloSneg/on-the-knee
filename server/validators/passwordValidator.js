const ApiError = require('../exceptions/api-error');

module.exports = (value, { req }) => {
  // password must be from 8 to 512 symbols in length, not equal to an email and contains:
  // - at least 2 digits
  // - at least 1 lowercase letter
  // - at least 1 uppercase letter
  // - at least 1 special symbol (regex' Symbol and Punctuation 
  // from the table https://unicode.org/reports/tr18/#General_Category_Property)
  const equalsToEmail = value === req.body.email;
  if (equalsToEmail) {
    throw ApiError.BadRequest("Password must not equal to an email");
  }

  // const passwordMatch = /^(?=(.*\d){2})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9a-zA-Z]).{8,512}$/gm.test(value) 
  //   && /\p{S}|\p{P}/gu.test(value);

  // reworking the old version to include non-latin letters
  const passwordMatch = 
    value.match(/^.{8,512}/gm)[0].length === value.length
    && /(\p{S}|\p{P})/gu.test(value) 
    && /(\p{Lu})/gu.test(value)
    && /(\p{Ll})/gu.test(value)
    && /[0-9]{2}/gm.test(value);

  if (!passwordMatch) {
    throw ApiError.BadRequest(`Password must be from 8 to 512 symbols in length and contains: at least 2 digits, at least 1 lowercase latin letter, at least 1 uppercase latin letter, at least 1 special symbol`);
  }

  return true;
}