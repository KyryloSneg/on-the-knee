import "./styles/CheckoutPageDeliveryRadio.css";
import { forwardRef } from "react";
import StringActions from "../utils/StringActions";
import onRadioKeyDown from "../utils/onRadioKeyDown";
import DeliverySectionSelfDeliveryOption from "./DeliverySectionSelfDeliveryOption";
import DeliverySectionCourierOption from "./DeliverySectionCourierOption";

const CheckoutPageDeliveryRadio = forwardRef(({ 
  delivery, isChecked, onCheck, checkPrev, checkNext, setIsDirty, orderId = null, order = null, inputsId = null,
  selectedStorePickupPointId = null, setSelectedStorePickupPointId = null, selectedDeliveryId = null,
  register = null, errors = null, trigger = null, control = null, hasElevator = null, setHasElevator = null, 
  isToLiftOnTheFloor = null,  setIsToLiftOnTheFloor = null, selectedCourierScheduleId = null, 
  setSelectedCourierScheduleId = null, selectedCourierScheduleShift = null, setSelectedCourierScheduleShift = null
}, ref) => {
  let radioClassName = "radio-div";
  let wrapperClassName = "checkout-page-delivery-radio";

  if (isChecked) {
    radioClassName += " checked";
    wrapperClassName += " checked";
  }

  let childrenToRenderIfChecked = <div />;
  if (delivery.name === "self-delivery") {
    childrenToRenderIfChecked = (
      <DeliverySectionSelfDeliveryOption 
        orderId={orderId}
        setIsDirty={setIsDirty}
        selectedStorePickupPointId={selectedStorePickupPointId} 
        setSelectedStorePickupPointId={setSelectedStorePickupPointId} 
      />
    );
  } else if (delivery.name === "courier") {
    childrenToRenderIfChecked = (
      <DeliverySectionCourierOption 
        order={order}
        inputsId={inputsId}
        setIsDirty={setIsDirty}
        register={register}
        errors={errors}
        trigger={trigger}
        control={control}
        selectedDeliveryId={selectedDeliveryId}
        hasElevator={hasElevator}
        setHasElevator={setHasElevator}
        isToLiftOnTheFloor={isToLiftOnTheFloor}
        setIsToLiftOnTheFloor={setIsToLiftOnTheFloor}
        selectedCourierScheduleId={selectedCourierScheduleId}
        setSelectedCourierScheduleId={setSelectedCourierScheduleId}
        selectedCourierScheduleShift={selectedCourierScheduleShift}
        setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
      />
    );
  }

  const isFree = order.isFreeDelivery || !delivery.price;
  
  return (
    <div className={wrapperClassName}>
      <button 
        role="radio" 
        aria-checked={isChecked} 
        type="button"
        onClick={onCheck}
        onKeyDown={(e) => onRadioKeyDown(e, checkPrev, checkNext)}
        ref={ref}
      >
        <div className={radioClassName} />
        <span>{StringActions.capitalize(delivery.name)} </span>
        <strong className={isFree ? "free" : ""}>
          {isFree ? "Free" : `${delivery.price} $`}
        </strong>
      </button>
      {isChecked && childrenToRenderIfChecked}
    </div>
  );
});

export default CheckoutPageDeliveryRadio;
