import { PASSWORD_VALIDATION_OBJ } from "./inputOptionsConsts";

// if mustNotBeEqualToValuesObj has form field names as its keys, pass getValues 
export default function isPasswordValidFunction(
  password, mustNotBeEqualToValuesObj = {}, getValues = null
) {
  let isValid = true;
  let isValidDetails = {};

  for (let [key, validateFn] of Object.entries(PASSWORD_VALIDATION_OBJ)) {
    let validationResult = validateFn(password);
    let didPassValidation = typeof validationResult === "boolean";

    isValidDetails[key] = didPassValidation;
    if (!didPassValidation && isValid) {
      isValid = false;
    }
  }

  for (let [key, value] of Object.entries(mustNotBeEqualToValuesObj)) {
    let valueToNotBeEqualTo;

    // key could be either a field name or the value itself
    if (getValues) {
      valueToNotBeEqualTo = getValues(key) || key;
    } else {
      valueToNotBeEqualTo = key;
    }

    let validationResult =
      (password || "").replaceAll(" ", "") !== valueToNotBeEqualTo.replaceAll(" ", "");

    isValidDetails[value.errorMsgKey] = validationResult;
    if (!validationResult && isValid) {
      isValid = false;
    }
  }

  return { isValid, isValidDetails };
};