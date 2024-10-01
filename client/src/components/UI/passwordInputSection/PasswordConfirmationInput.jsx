import { useMemo, useRef } from "react";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../../../utils/consts";
import _ from "lodash";
import { PASSWORD_VALIDATION_OBJ, REQUIRED_BASE_OPTIONS } from "../../../utils/inputOptionsConsts";
import ReactHookFormInput from "../reactHookFormInput/ReactHookFormInput";
import getPasswordInputFieldName from "../../../utils/getPasswordInputFieldName";

const PasswordConfirmationInput = ({ 
  register, errors, trigger, getValues, 
  uniqueInputVariantName, prevIsValidPasswordConfirmationRef
}) => {
  const prevIsValid = useRef(null);

  const passwordConfirmationFieldName = `${uniqueInputVariantName}-password-confirmation`;
  const passwordOptions = useMemo(() => {
    const passwordInputFieldName = getPasswordInputFieldName(uniqueInputVariantName);
    
    let passwordOptionsCopy = _.cloneDeep(REQUIRED_BASE_OPTIONS);
    passwordOptionsCopy.validate.isAppropriateLength = PASSWORD_VALIDATION_OBJ.isAppropriateLength;
    passwordOptionsCopy.validate.isEqualToPassword = value => {
      // using get values instead of useWatch because the hook returns not up-to-date password input's value
      return value === getValues(passwordInputFieldName) || "The value is not equal to the password";
    }

    passwordOptionsCopy.onChange = (e) => {
      const isValid = e.target.value === getValues(passwordInputFieldName);
      
      if (isValid !== prevIsValid.current) {
        trigger(passwordConfirmationFieldName);
        prevIsValid.current = isValid;

        // this ref is used in registering the password input
        prevIsValidPasswordConfirmationRef.current = isValid;
      }
    }

    return passwordOptionsCopy;
  }, [passwordConfirmationFieldName, trigger, uniqueInputVariantName, getValues, prevIsValidPasswordConfirmationRef]);

  const passwordConfirmationRegisterResult = register(
    passwordConfirmationFieldName,
    passwordOptions
  );

  return (
    <ReactHookFormInput
      type="password"
      labelText="Password confirmation"
      inputName={passwordConfirmationFieldName}
      errors={errors}
      registerFnResult={passwordConfirmationRegisterResult}
      className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
    />
  );
}

export default PasswordConfirmationInput;
