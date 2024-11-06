import { useMemo, useRef } from "react";
import { PASSWORD_INPUT_OPTIONS, PASSWORD_VALIDATION_MESSAGES_OBJ, REQUIRED_PASSWORD_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import _ from "lodash";
import isPasswordValidFunction from "../utils/isPasswordValidFunction";
import getPasswordInputFieldName from "../utils/getPasswordInputFieldName";

// uniqueVariantName is the name that used in passwordFieldName (`${selectedVariant}-password`)
// we pass getValues and mustNotBeEqualToValuesObj if we want to prevent equality of password to the obj's values email
// we pass getValues, isWithPasswordConfirmation and prevIsValidPasswordConfirmation if we use password confirmation input
// onChangeCb can have inputValue as its argument
export default function useRegisteringPasswordInput(
  register, trigger, uniqueVariantName, isWithPasswordConfirmation = false, 
  prevIsValidPasswordConfirmation = null, mustNotBeEqualToValuesObj = {}, 
  getValues = null, onChangeCb = null, isRequired = true,
) {
  const prevIsValidDetails = useRef(null);

  const passwordFieldName = getPasswordInputFieldName(uniqueVariantName);
  const passwordOptions = useMemo(() => {
    let passwordOptionsCopy = _.cloneDeep(isRequired ? REQUIRED_PASSWORD_INPUT_OPTIONS : PASSWORD_INPUT_OPTIONS);

    for (let [key, objValue] of Object.entries(mustNotBeEqualToValuesObj)) {
      passwordOptionsCopy.validate[objValue.validationFieldName] = value => {
        // getting the value inside the validation function to get the up-to-date one
        const valueToNotBeEqualTo = getValues?.(key) || key;
        
        return value.replaceAll(" ", "") !== valueToNotBeEqualTo.replaceAll(" ", "") || 
          PASSWORD_VALIDATION_MESSAGES_OBJ[objValue.errorMsgKey];
      }
    }

    passwordOptionsCopy.onChange = (e) => {
      const { isValidDetails } = isPasswordValidFunction(e.target.value, mustNotBeEqualToValuesObj, getValues);
      
      if (!_.isEqual(isValidDetails, prevIsValidDetails.current)) {
        trigger(passwordFieldName);
        prevIsValidDetails.current = isValidDetails;
      }

      if (isWithPasswordConfirmation && getValues && prevIsValidPasswordConfirmation) {
        // triggering password confirmation input on every password change 
        // that changes the validity of the password confirmation input
        const isValidPasswordConfirmation = e.target.value === getValues(`${uniqueVariantName}-password-confirmation`);
  
        if (isValidPasswordConfirmation !== prevIsValidPasswordConfirmation.current) {
          trigger(`${uniqueVariantName}-password-confirmation`);
          prevIsValidPasswordConfirmation.current = isValidPasswordConfirmation;
        };
      }

      onChangeCb?.(e.target.value);
    }

    return passwordOptionsCopy;
  }, [
    passwordFieldName, trigger, isWithPasswordConfirmation, prevIsValidPasswordConfirmation,
    getValues, uniqueVariantName, mustNotBeEqualToValuesObj, onChangeCb, isRequired
  ]);

  const passwordRegisterResult = register(
    passwordFieldName, 
    passwordOptions
  );

  return { passwordFieldName, passwordOptions, passwordRegisterResult };
};