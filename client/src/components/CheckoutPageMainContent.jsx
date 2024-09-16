import "./styles/CheckoutPageMainContent.css";
import CheckoutPageAddressDataSection from "./CheckoutPageAddressDataSection";
import CheckoutPagePaymentSection from "./CheckoutPagePaymentSection";
import CheckoutPageOrdersList from "./CheckoutPageOrdersList";

const CheckoutPageMainContent = ({
  register, errors, trigger, control, isSenderPhoneInputDirty, setIsSenderPhoneInputDirty,
  senderPhoneInputValue, setSenderPhoneInputValue, senderPhoneNumberInputRef, cartDataFetching
}) => {
  return (
    <main className="checkout-page-main-content">
      <CheckoutPageAddressDataSection
        register={register}
        errors={errors}
        trigger={trigger}
        isPhoneInputDirty={isSenderPhoneInputDirty}
        setIsPhoneInputDirty={setIsSenderPhoneInputDirty}
        phoneInputValue={senderPhoneInputValue}
        setPhoneInputValue={setSenderPhoneInputValue}
        phoneNumberInputRef={senderPhoneNumberInputRef}
        type="sender"
      />
      <CheckoutPageOrdersList 
        register={register}
        errors={errors}
        trigger={trigger}
        control={control}
        cartDataFetching={cartDataFetching}
      />
      <CheckoutPagePaymentSection />
    </main>
  );
};

export default CheckoutPageMainContent;
