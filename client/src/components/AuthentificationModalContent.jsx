import "./styles/AuthentificationModalContent.css";
import AuthentificationModalForm from "./AuthentificationModalForm";
import AuthentificationModalVariationsList from "./AuthentificationModalVariationsList";
import { useCallback, useContext, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import isPhoneValidFn from "../utils/isPhoneValid";
import { AUTHENTIFICATION_MODAL_INPUT_SERVICE_CLASS, AUTHENTIFICATION_MODAL_SUBMIT_BTN_SERVICE_CLASS } from "../utils/consts";
import _ from "lodash";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";
import { AxiosError } from "axios";
import useLodashThrottle from "hooks/useLodashThrottle";

const VARIANTS = Object.freeze(["registration", "authentificateWithPhone", "authentificateWithEmail"]);
const MAX_AUTH_ATTEMPTS = 8;

const AuthentificationModalContent = observer(({ closeModal }) => {
  const { app, user } = useContext(Context);

  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0]);
  const [authLeftAttempts, setAuthLeftAttempts] = useState(MAX_AUTH_ATTEMPTS);
  const [possibleError, setPossibleError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadySubmittingRef = useRef(false);
  const hasAlreadyTriedToAuthRef = useRef(false);

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

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, {selectedVariant === "registration" ? "registration" : "authentification"} has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "auth-modal-registration-submit-error", className: "" });
    app.setErrorModalBtnRef({ current: document.querySelector(`.${AUTHENTIFICATION_MODAL_SUBMIT_BTN_SERVICE_CLASS}`) || null });
    app.setIsToFocusErrorModalPrevModalTriggerElem(false);

    setErrorModalVisibility(true, app);
  }, [app, selectedVariant]);

  const submitCallback = useCallback(async (value) => {
    // we can change possible error state only if main logic has been invoked
    let callbackPossibleError = null;
    let hasBeenMainLogicInvoked = false;

    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsSubmitting(true);
      const password = value[`${selectedVariant}-password`];

      if (selectedVariant === "registration") {
        const name = value[`${selectedVariant}-firstName`];
        const surname = value[`${selectedVariant}-secondName`];
        const email = value[`${selectedVariant}-email`];
        const phoneNumber = phoneInputInfos[selectedVariant].value;

        hasBeenMainLogicInvoked = true;
        callbackPossibleError = await user.register(name, surname, password, email, phoneNumber);
      } else {
        let address;
        if (selectedVariant === "authentificateWithPhone") {
          address = phoneInputInfos[selectedVariant].value;
        } else if (selectedVariant === "authentificateWithEmail") {
          address = value[`${selectedVariant}-email`];
        }

        // if the server informs that the password is incorrect
        // try again with a trimmed variant if there are whitespaces aside
        // (spaces are allowed in passwords as i know)
        hasBeenMainLogicInvoked = true;
        callbackPossibleError = await user.login(address, password);
        
        if (callbackPossibleError?.response && callbackPossibleError?.code !== AxiosError.ERR_NETWORK) {
          const trimmedPassword = password.trim();
          if (trimmedPassword !== password) {
            callbackPossibleError = await user.login(address, trimmedPassword);
          }
        }
        
        if (callbackPossibleError?.response && callbackPossibleError?.code !== AxiosError.ERR_NETWORK) {
          setAuthLeftAttempts(value => value ? value - 1 : 0);
          hasAlreadyTriedToAuthRef.current = true;
        }
      }
      
      // if we get ERR_NETWORK from the server (it has crashed for example), open the error modal
      if (!callbackPossibleError?.response && callbackPossibleError?.code === AxiosError.ERR_NETWORK) {
        openErrorModal();
      } else if (!callbackPossibleError) {
        closeModal();
      }
    } catch(e) {
      openErrorModal();
    } finally {
      if (hasBeenMainLogicInvoked) {
        if (
          (callbackPossibleError?.response && callbackPossibleError?.code !== AxiosError.ERR_NETWORK) 
          || !callbackPossibleError
        ) {
          setPossibleError(callbackPossibleError);
        };
      };

      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [closeModal, openErrorModal, phoneInputInfos, selectedVariant, user]);
  
  function checkInputsValidAndHandleInvalidInputFocus(isErrorHandler, errorsFromHandler = null) {
    let areInputsValid = true;

    if (phoneInputInfos[selectedVariant] && !phoneInputInfos[selectedVariant]?.isPhoneInputDirty) {
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
          phoneInputInfos[selectedVariant]
          && !isPhoneValidFn(phoneInputInfos[selectedVariant]?.value) 
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

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  function onSubmit(value) {
    if (!checkInputsValidAndHandleInvalidInputFocus(false)) return;

    let areAuthAttemptsLeft = true;
    if (
      (selectedVariant === "authentificateWithPhone" || selectedVariant === "authentificateWithEmail")
      && authLeftAttempts <= 0
    ) {
      areAuthAttemptsLeft = false;
    };

    if (areAuthAttemptsLeft) throttledSubmitCallback(value);
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
        authLeftAttempts={authLeftAttempts}
        hasAlreadyTriedToAuthRef={hasAlreadyTriedToAuthRef}
        possibleError={possibleError}
        isSubmitting={isSubmitting}
      />
      <AuthentificationModalVariationsList 
        selectedVariation={selectedVariant} 
        setSelectedVariation={setSelectedVariant}
        variations={VARIANTS}
      />
    </div>
  );
});

export default AuthentificationModalContent;
