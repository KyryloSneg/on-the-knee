import "./PasswordInputSection.css";
import useRegisteringPasswordInput from "../../../hooks/useRegisteringPasswordInput";
import ReactHookFormInput from "../reactHookFormInput/ReactHookFormInput";
import PasswordInputValidityRules from "./PasswordInputValidityRules";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../../../utils/consts";
import PasswordConfirmationInput from "./PasswordConfirmationInput";
import { useRef } from "react";

// IMPORTANT: use memoization alongstead this object to prevent infinite re-renders
// if mustNotBeEqualToValuesObj contains a value as its key, pass getValues prop

// mustNotBeEqualToValuesObj = {
//   formFieldNameOrValue: {
//     errorMsgKey: "...",
//     validationFieldName: "...",
//   },
//   // we can use either a field name or the value itself
//   "modal-email": {
//     // errorMsgKey is a key of PASSWORD_VALIDATION_MESSAGES_OBJ
//     errorMsgKey: "isNotEqualToEmail",
//     // validationFieldName is an unique field name to use in the useRegisteringPasswordInput hook
//     validationFieldName: "isNotEqualToEmail",
//   },
//   "example@gmail.com": {
//     errorMsgKey: "isNotEqualToEmail",
//     validationFieldName: "isNotEqualToEmail",
//   },
// }

// onChangeCb must be wrapped with the useCallback() hook
const defaultMustNotBeEqualToValuesObj = {};
const PasswordInputSection = ({ 
  register, errors, control, trigger, uniqueInputVariantName, labelText = "Password",
  isWithPasswordConfirmation = false, isWithValidityRules = true, 
  mustNotBeEqualToValuesObj = defaultMustNotBeEqualToValuesObj, 
  getValues = null, onChangeCb = null
}) => {
  // empty password input === empty password confirmation input
  const prevIsValidPasswordConfirmation = useRef(true);

  const { 
    passwordFieldName, 
    passwordRegisterResult 
  } = useRegisteringPasswordInput(
    register, trigger, uniqueInputVariantName, isWithPasswordConfirmation, prevIsValidPasswordConfirmation, 
    mustNotBeEqualToValuesObj, getValues, onChangeCb, true
  );

  return (
    <div className="password-input-section">
      <ReactHookFormInput
        type="password"
        labelText={labelText}
        inputName={passwordFieldName}
        errors={errors}
        registerFnResult={passwordRegisterResult}
        isToRenderErrorMsg={false}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      {isWithValidityRules && 
        <PasswordInputValidityRules 
          control={control}
          passwordFieldName={passwordFieldName}
          mustNotBeEqualToValuesObj={mustNotBeEqualToValuesObj}
          getValues={getValues}
        />
      }
      {isWithPasswordConfirmation &&
        <PasswordConfirmationInput 
          register={register} 
          errors={errors} 
          trigger={trigger} 
          getValues={getValues}
          passwordLabelText={labelText}
          uniqueInputVariantName={uniqueInputVariantName}
          prevIsValidPasswordConfirmationRef={prevIsValidPasswordConfirmation}
        />
      }
    </div>
  );
}

export default PasswordInputSection;
