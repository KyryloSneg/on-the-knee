import { useMemo, useRef } from "react";
import { PASSWORD_INPUT_OPTIONS, REQUIRED_PASSWORD_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import _ from "lodash";
import isPasswordValidFunction from "../utils/isPasswordValidFunction";

// uniqueVariantName is the name that used in passwordFieldName (`${selectedVariant}-password`)
export default function useRegisteringPasswordInput(
  register, trigger, uniqueVariantName, isRequired = true, isWithPasswordConfirmation = false
) {
  const prevIsValidDetails = useRef(null);

  const passwordFieldName = `${uniqueVariantName}-password`;
  const passwordOptions = useMemo(() => {
    let passwordOptionsCopy = _.cloneDeep(isRequired ? REQUIRED_PASSWORD_INPUT_OPTIONS : PASSWORD_INPUT_OPTIONS);
    passwordOptionsCopy.onChange = (e) => {
      const { isValidDetails } = isPasswordValidFunction(e.target.value);
      
      if (!_.isEqual(isValidDetails, prevIsValidDetails.current)) {
        trigger(passwordFieldName);
        prevIsValidDetails.current = isValidDetails;
      }

      // triggering password confirmation input on every password change
      trigger(`${uniqueVariantName}-password-confirmation`);
    }

    return passwordOptionsCopy;
  }, [passwordFieldName, trigger, uniqueVariantName, isRequired]);

  const passwordRegisterResult = register(
    passwordFieldName, 
    passwordOptions
  );

  return { passwordFieldName, passwordOptions, passwordRegisterResult };
};