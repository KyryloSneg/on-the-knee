import "./styles/AuthentificationModalForm.css";
import AuthentificationModalRegisterInputs from "./AuthentificationModalRegisterInputs";
import AuthentificationModalAuthPhoneInputs from "./AuthentificationModalAuthPhoneInputs";
import AuthentificationModalAuthEmailInputs from "./AuthentificationModalAuthEmailInputs";
import UIButton from "./UI/uiButton/UIButton";

const AuthentificationModalForm = ({
  onSubmit, register, errors, control, trigger, getValues,
  selectedVariant, phoneInputInfos, setPhoneInputInfos,
  phoneInputRefs
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
        />
      );
    }
  }

  let btnText = "Submit";
  if (selectedVariant === "registration") {
    btnText = "Register";
  } else if (selectedVariant === "authentificateWithPhone" || selectedVariant === "authentificateWithEmail") {
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
      <UIButton variant="modal-submit" type="submit">
        {btnText}
      </UIButton>
    </form>
  );
}

export default AuthentificationModalForm;
