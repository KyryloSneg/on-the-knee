import { PASSWORD_VALIDATION_OBJ } from "./inputOptionsConsts";

// we must pass getValues, mustNotBeEqualToEmail and emailFieldName to do the corresponding validation
export default function isPasswordValidFunction(
  password, mustNotBeEqualToEmail = false, getValues = null, emailFieldName = null
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

  if (mustNotBeEqualToEmail && getValues && emailFieldName) {
    let validationResult = 
      (password || "").replaceAll(" ", "") !== (getValues(emailFieldName) || "").replaceAll(" ", "");

    isValidDetails.isNotEqualToEmail = validationResult;
    if (!validationResult && isValid) {
      isValid = false;
    }
  }

  return { isValid, isValidDetails };
};