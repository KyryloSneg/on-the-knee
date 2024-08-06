import "./styles/CheckoutPageMainContent.css";
import CheckoutPageSenderSection from "./CheckoutPageSenderSection";

const CheckoutPageMainContent = ({ 
  register, errors, trigger, isPhoneInputDirty, setIsPhoneInputDirty, 
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  emailInputRef 
}) => {
  return (
    <main className="checkout-page-main-content">
      <CheckoutPageSenderSection 
        register={register} 
        errors={errors} 
        trigger={trigger}
        isPhoneInputDirty={isPhoneInputDirty} 
        setIsPhoneInputDirty={setIsPhoneInputDirty}
        phoneInputValue={phoneInputValue}
        setPhoneInputValue={setPhoneInputValue}
        phoneNumberInputRef={phoneNumberInputRef}
        emailInputRef={emailInputRef}
      />
    </main>
  );
}

export default CheckoutPageMainContent;
