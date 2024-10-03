import "./PasswordInputSection.css";
import useRegisteringPasswordInput from "../../../hooks/useRegisteringPasswordInput";
import ReactHookFormInput from "../reactHookFormInput/ReactHookFormInput";
import PasswordInputValidityRules from "./PasswordInputValidityRules";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../../../utils/consts";
import PasswordConfirmationInput from "./PasswordConfirmationInput";
import { useRef } from "react";

// we must pass getValues fn if isWithPasswordConfirmation is equals to true
// we must pass getValues, mustNotBeEqualToEmail and emailFieldName to do the corresponding validation
const PasswordInputSection = ({ 
  register, errors, control, trigger, uniqueInputVariantName, 
  isWithPasswordConfirmation = false, mustNotBeEqualToEmail = false, 
  getValues = null, emailFieldName = null
}) => {
  // empty password input === empty password confirmation input
  const prevIsValidPasswordConfirmation = useRef(true);

  const { 
    passwordFieldName, 
    passwordRegisterResult 
  } = useRegisteringPasswordInput(
    register, trigger, uniqueInputVariantName, isWithPasswordConfirmation, 
    prevIsValidPasswordConfirmation, getValues, mustNotBeEqualToEmail, emailFieldName, true
  );

  return (
    <div className="password-input-section">
      <ReactHookFormInput
        type="password"
        labelText="Password"
        inputName={passwordFieldName}
        errors={errors}
        registerFnResult={passwordRegisterResult}
        isToRenderErrorMsg={false}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      <PasswordInputValidityRules 
        control={control} 
        passwordFieldName={passwordFieldName} 
        mustNotBeEqualToEmail={mustNotBeEqualToEmail}
        getValues={getValues}
        emailFieldName={emailFieldName}
      />
      {isWithPasswordConfirmation &&
        <PasswordConfirmationInput 
          register={register} 
          errors={errors} 
          trigger={trigger} 
          getValues={getValues}
          uniqueInputVariantName={uniqueInputVariantName}
          prevIsValidPasswordConfirmationRef={prevIsValidPasswordConfirmation}
        />
      }
    </div>
  );
}

export default PasswordInputSection;
