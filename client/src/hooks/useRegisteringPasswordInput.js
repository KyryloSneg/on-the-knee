import { useMemo, useRef } from "react";
import { PASSWORD_INPUT_OPTIONS, PASSWORD_VALIDATION_MESSAGES_OBJ, REQUIRED_PASSWORD_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import _ from "lodash";
import isPasswordValidFunction from "../utils/isPasswordValidFunction";
import getPasswordInputFieldName from "../utils/getPasswordInputFieldName";

// uniqueVariantName is the name that used in passwordFieldName (`${selectedVariant}-password`)
// we pass getValues, mustNotBeEqualToEmail and emailFieldName if we want to not pass password that equals to email
// we pass getValues, isWithPasswordConfirmation and prevIsValidPasswordConfirmation if we use password confirmation input
export default function useRegisteringPasswordInput(
  register, trigger, uniqueVariantName, isWithPasswordConfirmation = false, prevIsValidPasswordConfirmation = null,
  getValues = null, mustNotBeEqualToEmail = false, emailFieldName = null, isRequired = true,
) {
  const prevIsValidDetails = useRef(null);

  const passwordFieldName = getPasswordInputFieldName(uniqueVariantName);
  const passwordOptions = useMemo(() => {
    let passwordOptionsCopy = _.cloneDeep(isRequired ? REQUIRED_PASSWORD_INPUT_OPTIONS : PASSWORD_INPUT_OPTIONS);
    if (getValues && mustNotBeEqualToEmail && emailFieldName) {
      passwordOptionsCopy.validate.isNotEqualToEmail = value => 
        value.replaceAll(" ", "") !== getValues(`${uniqueVariantName}-email`).replaceAll(" ", "") 
        || PASSWORD_VALIDATION_MESSAGES_OBJ.isNotEqualToEmail;
    }

    passwordOptionsCopy.onChange = (e) => {
      const { isValidDetails } = isPasswordValidFunction(e.target.value);
      
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
    }

    return passwordOptionsCopy;
  }, [
    passwordFieldName, trigger, isWithPasswordConfirmation, prevIsValidPasswordConfirmation,
    getValues, uniqueVariantName, mustNotBeEqualToEmail, emailFieldName, isRequired
  ]);

  const passwordRegisterResult = register(
    passwordFieldName, 
    passwordOptions
  );

  return { passwordFieldName, passwordOptions, passwordRegisterResult };
};