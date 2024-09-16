import { observer } from 'mobx-react-lite';
import useSettingInitialSelectedScheduleId from '../hooks/useSettingInitialSelectedScheduleId';
import CheckoutPageDeliverySection from './CheckoutPageDeliverySection';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import useUpdatingCheckoutDeliverySectionValues from '../hooks/useUpdatingCheckoutDeliverySectionValues';
import { Context } from '../Context';
import CheckoutPageAddressDataSection from './CheckoutPageAddressDataSection';
import useSettingNonFirstDeliverySectionValues from '../hooks/useSettingNonFirstDeliverySectionValues';
import CheckoutPageOrderDeviceList from './CheckoutPageOrderDeviceList';

const CheckoutPageOrder = observer(({ 
  order, id, isMultiple, register, errors, trigger, control,
  selectedDeliverySection, setSelectedDeliverySection, cartDataFetching
}) => {
  const { app } = useContext(Context);
  const phoneNumberInputRef = useRef(null);

  const [isToShowDeliveryChangeMessage, setIsToShowDeliveryChangeMessage] = useState(false);
  const [isRadiogroupDirty, setIsRadiogroupDirty] = useState(false);
  const [isReceiventSectionDirty, setIsReceiventSectionDirty] = useState(false);
  const [selectedStorePickupPointId, setSelectedStorePickupPointId] = useState(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

  const [hasElevator, setHasElevator] = useState(null);
  const [isToLiftOnTheFloor, setIsToLiftOnTheFloor] = useState(false);
  const [selectedCourierScheduleId, setSelectedCourierScheduleId] = useState(null);
  const [selectedCourierScheduleShift, setSelectedCourierScheduleShift] = useState(null);

  const [isPhoneInputDirty, setIsPhoneInputDirty] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState("");

  // we must use app.selectedDeliveryIdValues in any way to make the component re-render
  // every time the state is changed (used for selecting the first delivery option, for example)
  // eslint-disable-next-line
  const ignore = useMemo(() => "ignore", [app.selectedDeliveryIdValues]);
  
  // NOTE: the order of the hooks below is important

  // resetting selectedStorePickupPointId on app.storePickupPoints, app.userLocation changes (usually of the second one)
  useEffect(() => {
    setSelectedStorePickupPointId(null);
  }, [app.storePickupPoints, app.userLocation]);

  useSettingInitialSelectedScheduleId(setSelectedCourierScheduleId, setSelectedCourierScheduleShift);
  useUpdatingCheckoutDeliverySectionValues(
    id, isToShowDeliveryChangeMessage, setIsToShowDeliveryChangeMessage,
    selectedStorePickupPointId, setSelectedStorePickupPointId,
    selectedDeliveryId, setSelectedDeliveryId, 
    hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor,
    selectedCourierScheduleId, setSelectedCourierScheduleId,
    selectedCourierScheduleShift, setSelectedCourierScheduleShift,
    phoneNumberInputRef, isPhoneInputDirty, setIsPhoneInputDirty,
    phoneInputValue, setPhoneInputValue
  );

  useSettingNonFirstDeliverySectionValues(
    id, isRadiogroupDirty, isMultiple, setSelectedDeliveryId,
    setSelectedStorePickupPointId, setSelectedCourierScheduleId,
    setSelectedCourierScheduleShift
  );

  return (
    <section className="checkout-page-order">
      <header>
        <h3>Order{isMultiple ? ` №${id}` : ""}</h3>
      </header>
      <CheckoutPageOrderDeviceList order={order} orderId={id} cartDataFetching={cartDataFetching} />
      {app.isToShowDeliveryChangeMessageValues?.[id]?.value &&
        <div className="delivery-change-message">
          <p>Delivery type has changed!</p>
        </div>
      }
      {/* render delivery section radiogroup only with already (initial) selected option */}
      {app.isToShowDeliverySectionRadiogroup &&
        <CheckoutPageDeliverySection
          orderId={id}
          order={order}
          setIsDirty={setIsRadiogroupDirty}
          register={register}
          errors={errors}
          control={control}
          setIsToShowDeliveryChangeMessage={setIsToShowDeliveryChangeMessage}
          selectedStorePickupPointId={selectedStorePickupPointId}
          setSelectedStorePickupPointId={setSelectedStorePickupPointId}
          selectedDeliveryId={selectedDeliveryId}
          setSelectedDeliveryId={setSelectedDeliveryId}
          hasElevator={hasElevator}
          setHasElevator={setHasElevator}
          isToLiftOnTheFloor={isToLiftOnTheFloor}
          setIsToLiftOnTheFloor={setIsToLiftOnTheFloor}
          selectedCourierScheduleId={selectedCourierScheduleId}
          setSelectedCourierScheduleId={setSelectedCourierScheduleId}
          selectedCourierScheduleShift={selectedCourierScheduleShift}
          setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
          selectedDeliverySection={selectedDeliverySection}
          setSelectedDeliverySection={setSelectedDeliverySection}
        />
      }
      <CheckoutPageAddressDataSection
        register={register}
        errors={errors}
        trigger={trigger}
        isPhoneInputDirty={isPhoneInputDirty}
        setIsPhoneInputDirty={setIsPhoneInputDirty}
        phoneInputValue={phoneInputValue}
        setPhoneInputValue={setPhoneInputValue}
        phoneNumberInputRef={phoneNumberInputRef}
        type="receivent"
        orderId={id}
        isReceiventSectionDirty={isReceiventSectionDirty}
        setIsReceiventSectionDirty={setIsReceiventSectionDirty}
      /> 
    </section>
  );
});

export default CheckoutPageOrder;
