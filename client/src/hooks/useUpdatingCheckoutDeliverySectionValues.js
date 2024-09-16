import _ from "lodash";

const { useEffect, useContext } = require("react");
const { Context } = require("../Context");

function useUpdatingCheckoutDeliverySectionValues(
  orderId, isToShowDeliveryChangeMessage, setIsToShowDeliveryChangeMessage,
  selectedStorePickupPointId, setSelectedStorePickupPointId, 
  selectedDeliveryId, setSelectedDeliveryId, 
  hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor, 
  selectedCourierScheduleId, setSelectedCourierScheduleId, 
  selectedCourierScheduleShift, setSelectedCourierScheduleShift,
  phoneNumberInputRef, isPhoneInputDirty, setIsPhoneInputDirty,
  phoneInputValue, setPhoneInputValue
) {
  const { app } = useContext(Context);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.isToShowDeliveryChangeMessageValues); 
    if (nextValue) {
      nextValue[orderId] = { value: isToShowDeliveryChangeMessage, setter: setIsToShowDeliveryChangeMessage };
    }

    app.setIsToShowDeliveryChangeMessageValues(nextValue);
  }, [app, orderId, isToShowDeliveryChangeMessage, setIsToShowDeliveryChangeMessage]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.hasElevatorValues); 
    if (nextValue) {
      nextValue[orderId] = { value: hasElevator, setter: setHasElevator };
    }

    app.setHasElevatorValues(nextValue);
  }, [app, orderId, hasElevator, setHasElevator]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.isToLiftOnTheFloorValues); 
    if (nextValue) {
      nextValue[orderId] = { value: isToLiftOnTheFloor, setter: setIsToLiftOnTheFloor };
    }

    app.setIsToLiftOnTheFloorValues(nextValue);
  }, [app, orderId, isToLiftOnTheFloor, setIsToLiftOnTheFloor]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.selectedCourierScheduleIdValues); 
    if (nextValue) {
      nextValue[orderId] = { value: selectedCourierScheduleId, setter: setSelectedCourierScheduleId };
    }

    app.setSelectedCourierScheduleIdValues(nextValue);
  }, [app, orderId, selectedCourierScheduleId, setSelectedCourierScheduleId]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.selectedCourierScheduleShiftValues); 
    if (nextValue) {
      nextValue[orderId] = { value: selectedCourierScheduleShift, setter: setSelectedCourierScheduleShift };
    }

    app.setSelectedCourierScheduleShiftValues(nextValue);
  }, [app, orderId, selectedCourierScheduleShift, setSelectedCourierScheduleShift]);

  useEffect(() => {
    try {
      let nextValue = _.cloneDeep(app.selectedDeliveryIdValues); 
      if (nextValue) {
        const areDeliveriesFetched = !!app.deliveries?.length;
        if (areDeliveriesFetched) {
          setSelectedDeliveryId(
            (areDeliveriesFetched && selectedDeliveryId === null) ? app.deliveries[0]?.id : selectedDeliveryId
          );
        }
        
        nextValue[orderId] = { 
          value: (areDeliveriesFetched && selectedDeliveryId === null) ? app.deliveries[0]?.id : selectedDeliveryId, 
          setter: setSelectedDeliveryId 
        };
      }
      
      app.setSelectedDeliveryIdValues(nextValue);
    } finally {
      // after try block execution is ended, we can render delivery section radiogroup with initially selected option
      app.setIsToShowDeliverySectionRadiogroup(true);
    }
  }, [app, orderId, selectedDeliveryId, setSelectedDeliveryId]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.selectedStorePickupPointIdValues); 
    if (nextValue) {
      nextValue[orderId] = { value: selectedStorePickupPointId, setter: setSelectedStorePickupPointId };
    }

    app.setSelectedStorePickupPointIdValues(nextValue);
  }, [app, orderId, selectedStorePickupPointId, setSelectedStorePickupPointId]);

  useEffect(() => {
    let nextValue = _.cloneDeep(app.receiventPhoneInputsValues); 
    if (nextValue) {
      nextValue[orderId] = { 
        value: phoneInputValue, 
        setPhoneInputValue, 
        isPhoneInputDirty,
        setIsPhoneInputDirty,
        ref: phoneNumberInputRef
      };
    }

    app.setReceiventPhoneInputsValues(nextValue);
  }, [app, orderId, phoneInputValue, setPhoneInputValue, isPhoneInputDirty, setIsPhoneInputDirty, phoneNumberInputRef]);
}

export default useUpdatingCheckoutDeliverySectionValues;