import "./styles/AuthentificationModalForm.css";
import AuthentificationModalRegisterInputs from "./AuthentificationModalRegisterInputs";
import AuthentificationModalAuthPhoneInputs from "./AuthentificationModalAuthPhoneInputs";
import AuthentificationModalAuthEmailInputs from "./AuthentificationModalAuthEmailInputs";
import UIButton from "./UI/uiButton/UIButton";
import { AUTHENTIFICATION_MODAL_SUBMIT_BTN_SERVICE_CLASS } from "../utils/consts";
import ServerErrorMsg from "./ServerErrorMsg";

const AuthentificationModalForm = ({
  onSubmit, register, errors, control, trigger, getValues,
  selectedVariant, phoneInputInfos, setPhoneInputInfos,
  phoneInputRefs, authLeftAttempts, hasAlreadyTriedToAuthRef, 
  possibleError, isSubmitting
}) => {
  function renderInputs() {
    if (selectedVariant === "registration") {
      return (
        <AuthentificationModalRegisterInputs 
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
      );
    } else if (selectedVariant === "authentificateWithPhone") {
      return (
        <AuthentificationModalAuthPhoneInputs 
          register={register}
          errors={errors}
          control={control}
          trigger={trigger}
          selectedVariant={selectedVariant}
          phoneInputInfos={phoneInputInfos}
          setPhoneInputInfos={setPhoneInputInfos}
          phoneInputRefs={phoneInputRefs}
        />
      );
    } else if (selectedVariant === "authentificateWithEmail") {
      return (
        <AuthentificationModalAuthEmailInputs 
          register={register}
          errors={errors}
          control={control}
          trigger={trigger}
          selectedVariant={selectedVariant}
          getValues={getValues}
        />
      );
    }
  }

  const isSelectedAuth = selectedVariant === "authentificateWithPhone" || selectedVariant === "authentificateWithEmail"

  let btnText = "Submit";
  if (selectedVariant === "registration") {
    btnText = "Register";
  } else if (isSelectedAuth) {
    btnText = "Log in";
  }

  return (
    <form
      className="authentification-modal-content-form"
      onSubmit={onSubmit}
    >
      <div className="authentification-modal-content-form-inputs-wrap">
        {renderInputs()}
      </div>
      {possibleError && <ServerErrorMsg error={possibleError} />}
      {(isSelectedAuth && hasAlreadyTriedToAuthRef.current) &&
        <p className="auth-modal-left-auth-attempts-msg">
          {authLeftAttempts} attempt{(authLeftAttempts > 1 || !authLeftAttempts) ? "s to log in are" : " to log in is"} left
        </p>
      }
      <UIButton 
        variant="modal-submit" 
        type="submit" 
        className={AUTHENTIFICATION_MODAL_SUBMIT_BTN_SERVICE_CLASS}
        isLoading={isSubmitting}
      >
        {btnText}
      </UIButton>
    </form>
  );
}

export default AuthentificationModalForm;
