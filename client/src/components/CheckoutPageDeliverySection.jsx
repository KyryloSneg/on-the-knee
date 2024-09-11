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
  orderId, order, setIsDirty, register, errors, control, setIsToShowDeliveryChangeMessage,
  selectedStorePickupPointId, setSelectedStorePickupPointId,
  selectedDeliveryId, setSelectedDeliveryId,
  hasElevator, setHasElevator, isToLiftOnTheFloor,
  setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift,
  selectedDeliverySection, setSelectedDeliverySection
}) => {
  const { app } = useContext(Context);
  const formValues = useWatch({ control });
  const inputsId = orderId;

  let selectedDelivery;
  let areRequiredCourierInputsFilled = false;
  // orderId is a string after prop passing somehow
  const isSelected = selectedDeliverySection === +orderId;

  if (!isSelected) {
    selectedDelivery = app.deliveries?.find(delivery => delivery.id === selectedDeliveryId);
    
    if (selectedDelivery?.name === "self-delivery") {
      areRequiredCourierInputsFilled = selectedCourierScheduleId !== null && selectedCourierScheduleId !== undefined;
    } else if (selectedDelivery?.name === "courier") {
      areRequiredCourierInputsFilled = !!formValues["street-" + inputsId] && !!formValues["houseNumber-" + inputsId];
    }
  }
  
  function onSectionSelect() {
    setSelectedDeliverySection(+orderId);
  }
  
  // we use the class below that was initially created for inputs 
  // for the button because it contains some general information (areRequiredCourierInputsFilled)
  // about inputs in the CheckoutPageDeliveryRadiogroup
  let btnClassName = `checkout-page-section-btn ${CHECKOUT_PAGE_INPUT_SERVICE_CLASS}`;
  if (!areRequiredCourierInputsFilled) {
    btnClassName += " error-variant";
  }

  return (
    <section className="checkout-page-delivery-section">
      <header>
        <h4>Delivery</h4>
      </header>
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
            data-isinvaliddeliverysectionbtn={!areRequiredCourierInputsFilled}
          >
            <img src={deliveryIcon} alt="" draggable="false" />
            <span>{StringActions.capitalize(selectedDelivery?.name || "")}</span>
            {!areRequiredCourierInputsFilled && 
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
