import { onEmailInputChange, REQUIRED_EMAIL_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { useRef } from "react";
import PasswordInputSection from "./UI/passwordInputSection/PasswordInputSection";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../utils/consts";
import getPasswordInputFieldName from "../utils/getPasswordInputFieldName";

const AuthentificationModalAuthEmailInputs = ({
  register, errors, control, trigger, selectedVariant, getValues
}) => {
  const isValidEmailRef = useRef(true);
  const prevIsPasswordEqualToEmailRef = useRef(true);

  const passwordInputFieldName = getPasswordInputFieldName(selectedVariant);

  const emailNameFieldName = `${selectedVariant}-email`;
  const emailNameRegisterResult = register(emailNameFieldName, {
    ...REQUIRED_EMAIL_INPUT_OPTIONS,
    onChange: (e) => onEmailInputChange(
      e, isValidEmailRef, trigger, emailNameFieldName, true, 
      passwordInputFieldName, getValues, prevIsPasswordEqualToEmailRef
    )
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
        getValues={getValues}
        mustNotBeEqualToEmail={true}
        emailFieldName={emailNameFieldName}
      />
    </>
  );
}

export default AuthentificationModalAuthEmailInputs;
