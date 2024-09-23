import { onEmailInputChange, REQUIRED_EMAIL_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { useRef } from "react";
import PasswordInputSection from "./UI/passwordInputSection/PasswordInputSection";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../utils/consts";

const AuthentificationModalAuthEmailInputs = ({
  register, errors, control, trigger, selectedVariant
}) => {
  const isValidEmailRef = useRef(true);

  const emailNameFieldName = `${selectedVariant}-email`;
  const emailNameRegisterResult = register(emailNameFieldName, {
    ...REQUIRED_EMAIL_INPUT_OPTIONS,
    onChange: (e) => onEmailInputChange(e, isValidEmailRef, trigger, emailNameFieldName)
  });

  return (
    <>
      <ReactHookFormInput
        labelText="Email"
        inputName={emailNameFieldName}
        errors={errors}
        registerFnResult={emailNameRegisterResult}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      <PasswordInputSection
        register={register}
        errors={errors}
        control={control}
        trigger={trigger}
        uniqueInputVariantName={selectedVariant}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
    </>
  );
}

export default AuthentificationModalAuthEmailInputs;
