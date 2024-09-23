import _ from "lodash";
import isPhoneValidFn from "../utils/isPhoneValid";
import { onEmailInputChange, REQUIRED_EMAIL_INPUT_OPTIONS, REQUIRED_TEXT_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { useEffect, useRef } from "react";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import PasswordInputSection from "./UI/passwordInputSection/PasswordInputSection";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../utils/consts";

const AuthentificationModalRegisterInputs = ({
  register, errors, control, trigger, getValues, 
  selectedVariant, phoneInputInfos, setPhoneInputInfos, phoneInputRefs
}) => {
  const phoneNumberInputRef = useRef(null);
  const isValidEmailRef = useRef(true);

  const phoneInputInfo = phoneInputInfos[selectedVariant];
  const isPhoneValid = isPhoneValidFn(phoneInputInfo.value);

  function onPhoneInputChange(value) {
    let nextPhoneInputInfos = _.cloneDeep(phoneInputInfos);
    nextPhoneInputInfos[selectedVariant].value = value;
    setPhoneInputInfos(nextPhoneInputInfos);
  }

  function onPhoneInputFocus() {
    let nextPhoneInputInfos = _.cloneDeep(phoneInputInfos);
    nextPhoneInputInfos[selectedVariant].isPhoneInputDirty = true
    setPhoneInputInfos(nextPhoneInputInfos);
  }

  const firstNameFieldName = `${selectedVariant}-firstName`;
  const firstNameRegisterResult = register(firstNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);

  const secondNameFieldName = `${selectedVariant}-secondName`;
  const secondNameRegisterResult = register(secondNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);

  const phoneInputId = `${selectedVariant}-phone-input`;

  const emailNameFieldName = `${selectedVariant}-email`;
  const emailNameRegisterResult = register(emailNameFieldName, {
    ...REQUIRED_EMAIL_INPUT_OPTIONS,
    onChange: (e) => onEmailInputChange(e, isValidEmailRef, trigger, emailNameFieldName)
  });

  useEffect(() => {
    phoneInputRefs.current[selectedVariant] = phoneNumberInputRef;
  }, [phoneInputRefs, selectedVariant, phoneNumberInputRef]);

  return (
    <>
      <ReactHookFormInput
        labelText="First name"
        inputName={firstNameFieldName}
        errors={errors}
        registerFnResult={firstNameRegisterResult}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      <ReactHookFormInput
        labelText="Second name"
        inputName={secondNameFieldName}
        errors={errors}
        registerFnResult={secondNameRegisterResult}
        className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
      />
      <div className="react-hook-form-input">
        <label htmlFor={phoneInputId}>
          Phone number
          <CustomPhoneInput
            defaultCountry="ua"
            value={phoneInputInfo.value}
            onChange={onPhoneInputChange}
            onFocus={onPhoneInputFocus}
            id={phoneInputId}
            isInvalid={phoneInputInfo.isPhoneInputDirty && !isPhoneValid}
            className={AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}
            ref={phoneNumberInputRef}
          />
        </label>
        {(phoneInputInfo.isPhoneInputDirty && !isPhoneValid) &&
          <p className="react-hook-form-input-error-msg" aria-live="polite">
            Phone number is not valid
          </p>
        }
      </div>
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
        isWithPasswordConfirmation={true}
        getValues={getValues}
      />
    </>
  );
}

export default AuthentificationModalRegisterInputs;
