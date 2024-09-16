import { Context } from "../Context";
import { FIRST_CHECKOUT_ORDER_ID } from "../utils/consts";

const { useEffect, useContext } = require("react");

function useSettingNonFirstDeliverySectionValues(
  id, isRadiogroupDirty, isMultiple, 
  setSelectedDeliveryId, setSelectedStorePickupPointId, 
  setSelectedCourierScheduleId, setSelectedCourierScheduleShift
) {
  const { app } = useContext(Context);

  // if user has changed the first delivery section radiogroup,
  // change values of the NOT DIRTY radiogroups to the one that user has just selected
  useEffect(() => {
    if (!isRadiogroupDirty && id !== FIRST_CHECKOUT_ORDER_ID && isMultiple) {
      const firstOrderSelectedDeliveryId = app.selectedDeliveryIdValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedDeliveryId) setSelectedDeliveryId(firstOrderSelectedDeliveryId);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedDeliveryIdValues, setSelectedDeliveryId]);

  useEffect(() => {
    if (!isRadiogroupDirty && id !== FIRST_CHECKOUT_ORDER_ID && isMultiple) {
      const firstOrderSelectedDeliveryId = app.selectedStorePickupPointIdValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedDeliveryId) setSelectedStorePickupPointId(firstOrderSelectedDeliveryId);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedStorePickupPointIdValues, setSelectedStorePickupPointId]);

  useEffect(() => {
    if (!isRadiogroupDirty && id !== FIRST_CHECKOUT_ORDER_ID && isMultiple) {
      const firstOrderSelectedCourierScheduleId = app.selectedCourierScheduleIdValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedCourierScheduleId) setSelectedCourierScheduleId(firstOrderSelectedCourierScheduleId);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedCourierScheduleIdValues, setSelectedCourierScheduleId]);

  useEffect(() => {
    if (!isRadiogroupDirty && id !== FIRST_CHECKOUT_ORDER_ID && isMultiple) {
      const firstOrderSelectedCourierScheduleShift = app.selectedCourierScheduleShiftValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedCourierScheduleShift) setSelectedCourierScheduleShift(firstOrderSelectedCourierScheduleShift);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedCourierScheduleShiftValues, setSelectedCourierScheduleShift]);
}

export default useSettingNonFirstDeliverySectionValues;