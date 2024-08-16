import "./styles/CheckoutPageDeliverySection.css";
import CheckoutPageDeliveryRadiogroup from "./CheckoutPageDeliveryRadiogroup";

const CheckoutPageDeliverySection = ({
  register, errors, watch, hasElevator, setHasElevator, isToLiftOnTheFloor,
  setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  return (
    <section className="checkout-page-delivery-section">
      <header>
        <h3>Delivery</h3>
      </header>
      <CheckoutPageDeliveryRadiogroup
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
    </section>
  );
}

export default CheckoutPageDeliverySection;
