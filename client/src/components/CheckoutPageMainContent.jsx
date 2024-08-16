import "./styles/CheckoutPageMainContent.css";
import CheckoutPageAddressDataSection from "./CheckoutPageAddressDataSection";
import CheckoutPageDeliverySection from "./CheckoutPageDeliverySection";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import CheckoutPagePaymentSection from "./CheckoutPagePaymentSection";

const CheckoutPageMainContent = observer(({
  register, errors, watch, trigger, isSenderPhoneInputDirty, setIsSenderPhoneInputDirty,
  senderPhoneInputValue, setSenderPhoneInputValue, senderPhoneNumberInputRef,
  isReceiventPhoneInputDirty, setIsReceiventPhoneInputDirty,
  receiventPhoneInputValue, setReceiventPhoneInputValue, receiventPhoneNumberInputRef,
  hasElevator, setHasElevator, isToLiftOnTheFloor,
  setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const { app } = useContext(Context);

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
      <CheckoutPageAddressDataSection
        register={register}
        errors={errors}
        trigger={trigger}
        isPhoneInputDirty={isReceiventPhoneInputDirty}
        setIsPhoneInputDirty={setIsReceiventPhoneInputDirty}
        phoneInputValue={receiventPhoneInputValue}
        setPhoneInputValue={setReceiventPhoneInputValue}
        phoneNumberInputRef={receiventPhoneNumberInputRef}
        type="receivent"
      />
    </main>
  );
});

export default CheckoutPageMainContent;
