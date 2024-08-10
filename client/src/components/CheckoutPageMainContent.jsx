import "./styles/CheckoutPageMainContent.css";
import CheckoutPageSenderSection from "./CheckoutPageSenderSection";
import CheckoutPageDeliverySection from "./CheckoutPageDeliverySection";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const CheckoutPageMainContent = observer(({ 
  register, errors, trigger, isPhoneInputDirty, setIsPhoneInputDirty, 
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  emailInputRef
}) => {
  const { app } = useContext(Context);

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
      {app.isToShowDeliveryChangeMessage &&
        <div className="delivery-change-message">
          <p>Delivery type has changed!</p>
        </div>
      }
      <CheckoutPageDeliverySection />
    </main>
  );
});

export default CheckoutPageMainContent;
