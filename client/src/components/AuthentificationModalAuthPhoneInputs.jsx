import { useEffect, useRef } from "react";
import isPhoneValidFn from "../utils/isPhoneValid";
import _ from "lodash";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import PasswordInputSection from "./UI/passwordInputSection/PasswordInputSection";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../utils/consts";

const AuthentificationModalAuthPhoneInputs = ({
  register, errors, control, trigger, selectedVariant, phoneInputInfos, setPhoneInputInfos, phoneInputRefs
}) => {
  const phoneNumberInputRef = useRef(null);

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

  const phoneInputId = `${selectedVariant}-phone-input`;

  useEffect(() => {
    phoneInputRefs.current[selectedVariant] = phoneNumberInputRef;
  }, [phoneInputRefs, selectedVariant, phoneNumberInputRef]);

  return (
    <>
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

export default AuthentificationModalAuthPhoneInputs;
