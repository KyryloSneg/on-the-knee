import "./styles/CheckoutPageDeliverySection.css";
import CheckoutPageDeliveryRadiogroup from "./CheckoutPageDeliveryRadiogroup";
import deliveryIcon from "../assets/delivery_24x24_434343.svg";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import StringActions from "../utils/StringActions";
import { useWatch } from "react-hook-form";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS } from "../utils/consts";

const CheckoutPageDeliverySection = observer(({
  orderId, order, setIsDirty, register, trigger, errors, control, 
  setIsToShowDeliveryChangeMessage, selectedStorePickupPointId, 
  setSelectedStorePickupPointId, selectedDeliveryId, setSelectedDeliveryId,
  hasElevator, setHasElevator, isToLiftOnTheFloor,
  setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift,
  selectedDeliverySection, setSelectedDeliverySection
}) => {
  const { app } = useContext(Context);
  const formValues = useWatch({ control });
  const inputsId = orderId;

  let selectedDelivery;
  let areRequiredOptionInputsFilled = false;
  // orderId is a string after prop passing somehow
  const isSelected = selectedDeliverySection === +orderId;

  if (!isSelected) {
    selectedDelivery = app.deliveries?.find(delivery => delivery.id === selectedDeliveryId);
    
    if (selectedDelivery?.name === "self-delivery") {
      areRequiredOptionInputsFilled = selectedStorePickupPointId !== null && selectedStorePickupPointId !== undefined;
    } else if (selectedDelivery?.name === "courier") {
      const areFilled = !!formValues["street-" + inputsId] && !!formValues["houseNumber-" + inputsId];
      // calculations below are correct only if the corresponding input was touched
      // and because of it isRequired inputs are valid here before user interaction,
      // but it's fine because isRequired fields are not filled and areFilled var returns false
      const isEveryInputValid = 
        !errors["street-" + inputsId] && !errors["houseNumber-" + inputsId]
        && !errors["flatNumber-" + inputsId] && !errors["floor-" + inputsId];

      areRequiredOptionInputsFilled = areFilled && isEveryInputValid;
    }
  }
  
  function onSectionSelect() {
    setSelectedDeliverySection(+orderId);
  }
  
  // we use the class below that was initially created for inputs 
  // for the button because it contains some general information (areRequiredOptionInputsFilled)
  // about inputs in the CheckoutPageDeliveryRadiogroup
  let btnClassName = `checkout-page-section-btn ${CHECKOUT_PAGE_INPUT_SERVICE_CLASS}`;
  if (!areRequiredOptionInputsFilled) {
    btnClassName += " error-variant";
  }

  return (
    <section className="checkout-page-delivery-section">
      <h4>Delivery</h4>
      {isSelected
        ? (
          <CheckoutPageDeliveryRadiogroup
            orderId={orderId}
            order={order}
            inputsId={inputsId}
            setIsDirty={setIsDirty}
            setIsToShowDeliveryChangeMessage={setIsToShowDeliveryChangeMessage}
            selectedStorePickupPointId={selectedStorePickupPointId}
            setSelectedStorePickupPointId={setSelectedStorePickupPointId}
            selectedDeliveryId={selectedDeliveryId}
            setSelectedDeliveryId={setSelectedDeliveryId}
            register={register}
            errors={errors}
            trigger={trigger}
            control={control}
            hasElevator={hasElevator}
            setHasElevator={setHasElevator}
            isToLiftOnTheFloor={isToLiftOnTheFloor}
            setIsToLiftOnTheFloor={setIsToLiftOnTheFloor}
            selectedCourierScheduleId={selectedCourierScheduleId}
            setSelectedCourierScheduleId={setSelectedCourierScheduleId}
            selectedCourierScheduleShift={selectedCourierScheduleShift}
            setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
          />
        )
        : (
          <button 
            className={btnClassName}
            type="button"
            onClick={onSectionSelect}
            data-isinvaliddeliverysectionbtn={!areRequiredOptionInputsFilled}
          >
            <img src={deliveryIcon} alt="" draggable="false" />
            <span>{StringActions.capitalize(selectedDelivery?.name || "")}</span>
            {!areRequiredOptionInputsFilled && 
              <span className="checkout-page-section-btn-required-error-msg">
                Required
              </span>
            }
            <span className="checkout-page-section-btn-change-msg"> Change</span>
          </button>
        )
      }
    </section>
  );
});

export default CheckoutPageDeliverySection;
