import { PASSWORD_VALIDATION_OBJ } from "./inputOptionsConsts";

export default function isPasswordValidFunction(password) {
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

  return { isValid, isValidDetails };
};