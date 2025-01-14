import CheckoutPageDeliveryRadio from "./CheckoutPageDeliveryRadio";
import { useContext, useEffect, useReducer, useRef } from 'react';
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import _ from "lodash";
import { getOneDelivery } from "../http/DeliveriesAPI";

const CheckoutPageDeliveryRadiogroup = observer(({
  orderId, order, inputsId, setIsDirty, setIsToShowDeliveryChangeMessage,
  selectedStorePickupPointId, setSelectedStorePickupPointId,
  selectedDeliveryId, setSelectedDeliveryId, register, errors, trigger, control,
  hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor,
  selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const { app } = useContext(Context);
  const optionRefs = useRef([]);
  const prevDeliveries = useRef(null);
  const isInitialRender = useRef(true);
  const isCallbackInvoked = useRef(false);
  // eslint-disable-next-line
  const [ignore, forceUpdate] = useReducer(x => x + 1, 0);
  // index is used for checking prev / next delivery
  const selectedIndex = app.deliveries?.indexOf(app.deliveries?.find(
    delivery => delivery.id === selectedDeliveryId)
  ) || 0;

  useEffect(() => {
    async function callback() {
      // do not try to seek any logical reason to excuse why isInitialRender.current can be true only on ~2nd render
      if (selectedDeliveryId === null) return;

      try {
        isCallbackInvoked.current = true;
        // selectedDeliveryId contains id of delivery selected before app.deliveries has changed
        // app.deliveries contains actual deliveries
        // so we can use these to do next steps: identify has delivery type changed;
        // if deliveries has changed, select previously selected delivery with the same delivery type as it was before
        const deliveryTypesIds = app.deliveries?.map(delivery => delivery["delivery-typeId"]);
        const prevSelectedDelivery = await getOneDelivery(selectedDeliveryId);
        const currentDeliveryWithPrevSelectedType = app.deliveries?.find(
          delivery => delivery["delivery-typeId"] === prevSelectedDelivery["delivery-typeId"]
        );

        if (currentDeliveryWithPrevSelectedType) setSelectedDeliveryId(currentDeliveryWithPrevSelectedType.id);

        if (prevSelectedDelivery && !!deliveryTypesIds?.length
          && !deliveryTypesIds.includes(prevSelectedDelivery["delivery-typeId"])
        ) {
          setIsToShowDeliveryChangeMessage(true);
        };
      } catch (e) {
        console.log(e.message);
      } finally {
        isCallbackInvoked.current = false;
        isInitialRender.current = false;
        forceUpdate();
      }
    }

    callback();
    // eslint-disable-next-line
  }, [app, app.deliveries, setSelectedDeliveryId]);

  if (!app.deliveries?.length) return;

  function checkItem(index) {
    const nextSelectedId = app.deliveries[index]?.id;

    setIsDirty(true);
    setSelectedDeliveryId(nextSelectedId);

    setIsToShowDeliveryChangeMessage(false);
  }

  function refCb(ref) {
    if (!_.isEqual(prevDeliveries.current, app.deliveries)) {
      // clearing up the option refs array to prevent controls errors
      // on changing a user location
      optionRefs.current = [];
      prevDeliveries.current = app.deliveries;
    }

    const hasBrokenLimit = optionRefs.current.length >= app.deliveries?.length;

    // ref could be null on re-renders, so don't put it in the optionRefs array
    if (hasBrokenLimit || !ref) return;
    optionRefs.current.push(ref);
  }

  const deliveryIds = app.deliveries?.map(delivery => delivery.id);

  // using this ugly code alongside with forceUpdate to make the transition
  // between default delivery (the first one in the app.deliveries)
  // and the delivery that has the same type that user selected before 
  // changing app.deliveries by, for example, changing user location 

  // do not return div, use display-none instead (to not invoke controls errors once again)
  let className = "checkout-page-delivery-radiogroup";
  if (
    ((selectedDeliveryId !== null && selectedDeliveryId !== undefined)
      && (deliveryIds?.length && !deliveryIds?.includes(selectedDeliveryId)))
    || (!isInitialRender.current && isCallbackInvoked.current)
  ) {
    className += " display-none";
  }

  return (
    <div className={className} role="radiogroup">
      {app.deliveries?.map((delivery, index) => {
        const isChecked = index === selectedIndex;

        function onCheck() {
          checkItem(index);
        }

        function checkNext() {
          if (app.deliveries?.length === 1) return;

          let id;
          if (index === app.deliveries?.length - 1) {
            id = 0;
          } else {
            id = index + 1;
          }

          checkItem(id);
          optionRefs.current[id]?.focus();
        }

        function checkPrev() {
          if (app.deliveries?.length === 1) return;

          let id;
          if (index === 0) {
            id = app.deliveries?.length - 1;
          } else {
            id = index - 1;
          }

          checkItem(id);
          optionRefs.current[id]?.focus();
        }

        return (
          <CheckoutPageDeliveryRadio
            key={delivery.id}
            delivery={delivery}
            isChecked={isChecked}
            onCheck={onCheck}
            checkPrev={checkPrev}
            checkNext={checkNext}
            orderId={orderId}
            order={order}
            inputsId={inputsId}
            setIsDirty={setIsDirty}
            selectedStorePickupPointId={selectedStorePickupPointId}
            setSelectedStorePickupPointId={setSelectedStorePickupPointId}
            selectedDeliveryId={selectedDeliveryId}
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
            ref={refCb}
          />
        );
      })}
    </div>
  );
});

export default CheckoutPageDeliveryRadiogroup;
