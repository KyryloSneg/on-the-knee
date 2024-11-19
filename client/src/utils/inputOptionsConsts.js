const { default: isEmailValidFn } = require("./isEmailValid");

export function getNumberInputOptions({ 
  isRequired = true, isNotNegative = false, isNotNegativeOrZero = false, 
  isNotFloat = true, additionalNonValidateOptions = {}, 
  minLength = 0, maxLength = Infinity
}) {
  let numberInputOptions = {
    ...additionalNonValidateOptions,
    validate: {}
  }

  // using both `${value}` and +value because we can provide the option in the register fn 
  // that will make value in the validation functions to be a number, not string as options' default value does,
  // so support both number and string representations of value in the validation
  if (isRequired) {
    numberInputOptions.validate.isRequired = value => !!`${value}`.trim().length || "Required field";
  }

  if (isNotNegative) {
    numberInputOptions.validate.isNotNegative = value => (+value >= 0 || value === "") || "Only a positive number or 0";
  }

  if (isNotNegativeOrZero) {
    numberInputOptions.validate.isNotNegative = value => (+value > 0 || value === "") || "Only a positive number";
  }

  if (isNotFloat) {
    numberInputOptions.validate.isNotFloat = value => Number.isInteger(+value) || "Can't be a float number";
  }

  // there's no any good reason to put isNotTooShort / (...Long) validation if the (min / max) length is <= 0 
  if (!!minLength && minLength > 0) {
    numberInputOptions.validate.isNotTooShort = value => (
      `${value}`.trim().length >= minLength 
      || `Can't be less than ${minLength} digit${minLength > 1 ? "s" : ""}`
    );
  }

  if (!!maxLength && maxLength > 0) {
    numberInputOptions.validate.isNotTooLong = value => (
      `${value}`.trim().length <= maxLength 
      || `Can't be more than ${maxLength} digit${maxLength > 1 ? "s" : ""}`
    );
  }

  return numberInputOptions;
}

// using only english letters
export function isOnlyLetters(value) {
  // do not forget that our regex doesn't detect whitespaces, so matches.length might be less than value.length.
  // to prevent that, delete all whitespaces from the value
  const valueWithoutSpaces = value.replaceAll(" ", "");
  // const matches = valueWithoutSpaces.match(/\p{Letter}/gu);
  const matches = valueWithoutSpaces.match(/[a-zA-Z]/g);

  const isOnlyLetters = matches?.length === valueWithoutSpaces.length;
  return isOnlyLetters || "Letters only";
}

export function isEnglishWithOptionalDigits(value) {
  const valueWithoutSpaces = value.replaceAll(" ", "");

  return (
    (/^[a-zA-Z0-9]+$/.test(valueWithoutSpaces) && isNaN(+valueWithoutSpaces)) 
    || "English chars with digits (or without) only"
  );
}

export function isValidEmail(value) {
  return isEmailValidFn(value.trim()) || "Incorrect email";
}

export const PASSWORD_VALIDATION_MESSAGES_OBJ = Object.freeze({
  isAppropriateLength: "The password must contain less than or equal to 512 characters",
  isValidLength: "The password must contain greater than or equal to 8 characters",
  doesContainTwoOrMoreDigits: "The password must contain at least two digits",
  doesContainASmallLetter: "The password must contain at least one small letter",
  doesContainAnUppercaseLetter: "The password must contain at least one uppercase letter",
  doesContainASpecialChar: "The password must contain at least one special character",
  isNotEqualToEmail: "The password mustn't be your email",
  isNotEqualToCurrentPassword: "The new password mustn't be your current password",
});

// min 8 chars
// 1-a 
// 1-A
// 2+ digit(s)
// 1+ special char(s)

// validation functions must always return a boolean value to use it 
// in isPasswordValidFunction without any errors
export const PASSWORD_VALIDATION_OBJ = Object.freeze({
  // overriding the validation from the base options because 1000 chars is too much ig
  // (and we have no need in .trim() method here)
  isAppropriateLength: value => value.length <= 512 || PASSWORD_VALIDATION_MESSAGES_OBJ.isAppropriateLength,
  isValidLength: value => value.length >= 8 || PASSWORD_VALIDATION_MESSAGES_OBJ.isValidLength,
  // using the regex anchors "^" and "$" makes the matches below return null for some reason
  doesContainTwoOrMoreDigits: value => (
    value.match(/[0-9]/g)?.length >= 2 || PASSWORD_VALIDATION_MESSAGES_OBJ.doesContainTwoOrMoreDigits
  ),
  doesContainASmallLetter: value => (
    /\p{Lowercase_Letter}/gu.test(value) || PASSWORD_VALIDATION_MESSAGES_OBJ.doesContainASmallLetter
  ),
  doesContainAnUppercaseLetter: value => (
    /\p{Uppercase_Letter}/gu.test(value) || PASSWORD_VALIDATION_MESSAGES_OBJ.doesContainAnUppercaseLetter
  ),
  doesContainASpecialChar: value => (
    /\p{S}|\p{P}/gu.test(value) || PASSWORD_VALIDATION_MESSAGES_OBJ.doesContainASpecialChar
  ),
});

// if we want to trigger password input, pass isToTriggerPasswordInput, 
// passwordInputFieldName, getValues and prevIsPasswordEqualToEmailRef args
// (we may want this behavior to trigger non-equality of password to email validation on email change)
export function onEmailInputChange(
  e, isValidEmailRef, trigger, fieldName, 
  isToTriggerPasswordInput = false, passwordInputFieldName = null,
  getValues = null, prevIsPasswordEqualToEmailRef = null
) {
  const isValid = isEmailValidFn(e.target.value.trim())
  if (isValid !== isValidEmailRef.current) {
    // manually triggering validation fn like it was with "onChange" mode
    // (with some optimization because it hits app's perfomance badly)
    trigger(fieldName);
    isValidEmailRef.current = isValid;
  }

  if (isToTriggerPasswordInput && passwordInputFieldName && getValues && prevIsPasswordEqualToEmailRef) {
    const isPasswordEqualToEmail = e.target.value === getValues(passwordInputFieldName);

    // the condition is used for optimization
    if (isPasswordEqualToEmail !== prevIsPasswordEqualToEmailRef.current) {
      trigger(passwordInputFieldName);
      prevIsPasswordEqualToEmailRef.current = isPasswordEqualToEmail;
    }
  }
}

export const REQUIRED_BASE_OPTIONS = Object.freeze({
  validate: {
    isRequired: value => !!value.trim().length || "Required field",
    isNotTooLong: (
      value => value.trim().length <= 1000 || "This field must contain less than or equal to 1000 characters"
    )
  }
});

// we can use it for optional inputs
export const BASE_OPTIONS = Object.freeze({
  validate: {
    // validate by isNotTooShort field only if user have typed anything in an input
    // (used for optional inputs to be optional)
    isNotTooShort: value => (value.trim().length === 0 || value.trim().length >= 3) || "This field must contain more than or equal to 3 characters",
    isNotTooLong: value => value.trim().length <= 1000 || "This field must contain less than or equal to 1000 characters",
  }
});

export const REQUIRED_TEXT_INPUT_OPTIONS = Object.freeze({
  ...REQUIRED_BASE_OPTIONS,
  validate: {
    ...REQUIRED_BASE_OPTIONS.validate,
    isOnlyLetters,
  }
});

export const TEXT_INPUT_OPTIONS = Object.freeze({
  ...BASE_OPTIONS,
  validate: {
    ...BASE_OPTIONS.validate,
    isOnlyLetters,
  }
});

export const REQUIRED_EMAIL_INPUT_OPTIONS = Object.freeze({
  ...REQUIRED_BASE_OPTIONS,
  validate: {
    ...REQUIRED_BASE_OPTIONS.validate,
    isValidEmail
  }
});

export const EMAIL_INPUT_OPTIONS = Object.freeze({
  ...BASE_OPTIONS,
  validate: {
    ...BASE_OPTIONS.validate,
    isValidEmail
  }
});

// do not freeze the options below to make it possible to add onChange manually on use
export const REQUIRED_PASSWORD_INPUT_OPTIONS = {
  ...REQUIRED_BASE_OPTIONS,
  validate: {
    ...REQUIRED_BASE_OPTIONS.validate,
    ...PASSWORD_VALIDATION_OBJ,
  }
};

export const PASSWORD_INPUT_OPTIONS = {
  ...BASE_OPTIONS,
  validate: {
    ...BASE_OPTIONS.validate,
    ...PASSWORD_VALIDATION_OBJ,
  }
};

export const REQUIRED_TEXTAREA_OPTIONS = Object.freeze({
  ...REQUIRED_BASE_OPTIONS,
  validate: {
    ...REQUIRED_BASE_OPTIONS.validate,
    isNotTooShort: (
      value => value.trim().length >= 3 || "This field must contain more than or equal to 3 characters"
    ),
    isNotTooLong: value => value.trim().length <= 3000 || "This field must contain less than or equal to 3000 characters",
  }
});

export const TEXTAREA_OPTIONS = Object.freeze({
  ...BASE_OPTIONS,
  validate: {
    ...BASE_OPTIONS.validate,
    isNotTooLong: value => value.trim().length <= 3000 || "This field must contain less than or equal to 3000 characters",
  }
});