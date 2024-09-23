import "./styles/AuthentificationModalContent.css";
import AuthentificationModalForm from "./AuthentificationModalForm";
import AuthentificationModalVariationsList from "./AuthentificationModalVariationsList";
import { useRef, useState } from 'react';
import useLodashDebounce from "../hooks/useLodashDebounce";
import { useForm } from "react-hook-form";
import isPhoneValidFn from "../utils/isPhoneValid";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS } from "../utils/consts";
import _ from "lodash";

const VARIANTS = Object.freeze(["registration", "authentificateWithPhone", "authentificateWithEmail"]);

const AuthentificationModalContent = ({ closeModal }) => {
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0]);
  const isAlreadySubmittingRef = useRef(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    setFocus,
    control,
    getValues
  } = useForm({
    mode: "onBlur",
    shouldFocusError: false,
  });

  let initPhoneInputInfo = {};
  let initPhoneInputRefs = {};

  for (let variant of VARIANTS) {
    // even if we'll add a new variant with no phone in future and forget to change this condition
    // it would still work well (there's just be an empty unused field)
    if (variant === "authentificateWithEmail") continue;
    initPhoneInputInfo[variant] = {
      value: "",
      isPhoneInputDirty: false,
    };

    // just a placeholder value
    initPhoneInputRefs[variant] = { current: null };
  }

  const [phoneInputInfos, setPhoneInputInfos] = useState(initPhoneInputInfo);
  const phoneInputRefs = useRef(initPhoneInputRefs);
  const debouncedSubmitCallback = useLodashDebounce(submitCallback, 500);

  async function submitCallback(value) {
    try {
      if (isAlreadySubmittingRef.current) { isAlreadySubmittingRef.current = false; return };
      isAlreadySubmittingRef.current = true;

      // TODO: if an auth variant is selected and the server returns that the password is incorrect
      // try again with a trimmed variant (spaces are allowed in passwords as i know)

    } catch(e) {
      console.log(e.message);
      // TODO: open the error modal
    } finally {
      isAlreadySubmittingRef.current = false;
    }
  }
  
  function checkInputsValidAndHandleInvalidInputFocus(isErrorHandler, errorsFromHandler = null) {
    let areInputsValid = true;

    if (!phoneInputInfos[selectedVariant].isPhoneInputDirty) {
      let nextPhoneInputInfos = _.cloneDeep(phoneInputInfos);
      nextPhoneInputInfos[selectedVariant].isPhoneInputDirty = true;
      setPhoneInputInfos(nextPhoneInputInfos);
    }

    const formInputs = Array.from(document.querySelectorAll(`.${AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS}`));

    for (let input of formInputs) {
      if (isErrorHandler && errorsFromHandler?.[input?.name]) {
        setFocus(input.name);
        areInputsValid = false;
        break;
        // if the current input is a phone number one !!errorsFromHandler?.[input?.name] is false
        // because errorsFromHandler includes only errors from the registered inputs
      } else if (
          !isPhoneValidFn(phoneInputInfos[selectedVariant].value) 
          && phoneInputRefs.current[selectedVariant]?.current?.isEqualNode(input)
        ) {
        // focus the invalid phone input only if it's located before invalid registered inputs
        input?.focus();
        areInputsValid = false;
        break;
      }
    }

    return areInputsValid;
  }

  function onSubmit(value) {
    if (!checkInputsValidAndHandleInvalidInputFocus(false)) return;

    debouncedSubmitCallback(value);
  }

  return (
    <div className="authentification-modal-content">
      <AuthentificationModalForm 
        onSubmit={handleSubmit(onSubmit, (errors) => checkInputsValidAndHandleInvalidInputFocus(true, errors))} 
        register={register}
        errors={errors}
        control={control}
        trigger={trigger}
        getValues={getValues}
        selectedVariant={selectedVariant}
        phoneInputInfos={phoneInputInfos}
        setPhoneInputInfos={setPhoneInputInfos}
        phoneInputRefs={phoneInputRefs}
      />
      <AuthentificationModalVariationsList 
        selectedVariation={selectedVariant} 
        setSelectedVariation={setSelectedVariant}
        variations={VARIANTS}
      />
    </div>
  );
}

export default AuthentificationModalContent;
