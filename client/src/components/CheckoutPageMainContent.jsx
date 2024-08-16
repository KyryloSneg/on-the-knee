import "./styles/CheckoutPageMainContent.css";
import CheckoutPageSenderSection from "./CheckoutPageSenderSection";
import CheckoutPageDeliverySection from "./CheckoutPageDeliverySection";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import CheckoutPagePaymentSection from "./CheckoutPagePaymentSection";

const CheckoutPageMainContent = observer(({
  register, errors, watch, trigger, isPhoneInputDirty, setIsPhoneInputDirty,
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  emailInputRef, hasElevator, setHasElevator, isToLiftOnTheFloor,
  setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
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
      <CheckoutPageDeliverySection
        register={register}
        errors={errors}
        watch={watch}
        hasElevator={hasElevator}
        setHasElevator={setHasElevator}
        isToLiftOnTheFloor={isToLiftOnTheFloor}
        setIsToLiftOnTheFloor={setIsToLiftOnTheFloor}
        selectedCourierScheduleId={selectedCourierScheduleId}
        setSelectedCourierScheduleId={setSelectedCourierScheduleId}
        selectedCourierScheduleShift={selectedCourierScheduleShift}
        setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
      />
      <CheckoutPagePaymentSection />
    </main>
  );
});

export default CheckoutPageMainContent;
