import "./PasswordInputSection.css";
import useRegisteringPasswordInput from "../../../hooks/useRegisteringPasswordInput";
import ReactHookFormInput from "../reactHookFormInput/ReactHookFormInput";
import PasswordInputValidityRules from "./PasswordInputValidityRules";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../../../utils/consts";
import PasswordConfirmationInput from "./PasswordConfirmationInput";

// we must pass getValues fn if isWithPasswordConfirmation is equals to true
const PasswordInputSection = ({ 
  register, errors, control, trigger, uniqueInputVariantName, 
  isWithPasswordConfirmation = false, getValues = null 
}) => {
  const { 
    passwordFieldName, 
    passwordRegisterResult 
  } = useRegisteringPasswordInput(register, trigger, uniqueInputVariantName, true, isWithPasswordConfirmation);

  return (
    <div className="password-input-section">
      <ReactHookFormInput
        labelText="Password"
        inputName={passwordFieldName}
        errors={errors}
        registerFnResult={passwordRegisterResult}
        isToRenderErrorMsg={false}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      <PasswordInputValidityRules control={control} passwordFieldName={passwordFieldName} />
      {isWithPasswordConfirmation &&
        <PasswordConfirmationInput 
          register={register} 
          errors={errors} 
          trigger={trigger} 
          getValues={getValues}
          uniqueInputVariantName={uniqueInputVariantName}
        />
      }
    </div>
  );
}

export default PasswordInputSection;
