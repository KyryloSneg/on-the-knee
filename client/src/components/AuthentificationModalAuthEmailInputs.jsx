import { onEmailInputChange, REQUIRED_EMAIL_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { useMemo, useRef } from "react";
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

  const passwordMustNotBeEqualToValuesObj = useMemo(() => {
    let result = {};
    result[emailNameFieldName] = {
      errorMsgKey: "isNotEqualToEmail",
      validationFieldName: "isNotEqualToEmail",
    };

    return result;
  }, [emailNameFieldName]);

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
        mustNotBeEqualToValuesObj={passwordMustNotBeEqualToValuesObj}
        getValues={getValues}
      />
    </>
  );
}

export default AuthentificationModalAuthEmailInputs;
