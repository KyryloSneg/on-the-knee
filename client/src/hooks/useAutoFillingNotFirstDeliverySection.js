import { Context } from "../Context";
import { FIRST_CHECKOUT_ORDER_ID } from "../utils/consts";

const { useEffect, useContext } = require("react");

function useAutoFillingNotFirstDeliverySection(
  id, isMultiple, isRadiogroupDirty, setSelectedDeliveryId, 
  setSelectedCourierScheduleId, setSelectedCourierScheduleShift
) {
  const { app } = useContext(Context);

  // if user has changed the first delivery section radiogroup,
  // change values of the NOT DIRTY radiogroups to the one that user has just selected
  useEffect(() => {
    if (!isRadiogroupDirty && id !== 1 && isMultiple) {
      const firstOrderSelectedDeliveryId = app.selectedDeliveryIdValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedDeliveryId) setSelectedDeliveryId(firstOrderSelectedDeliveryId);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedDeliveryIdValues]);

  useEffect(() => {
    if (!isRadiogroupDirty && id !== 1 && isMultiple) {
      const firstOrderSelectedCourierScheduleId = app.selectedCourierScheduleIdValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedCourierScheduleId) setSelectedCourierScheduleId(firstOrderSelectedCourierScheduleId);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedCourierScheduleIdValues]);

  useEffect(() => {
    if (!isRadiogroupDirty && id !== 1 && isMultiple) {
      const firstOrderSelectedCourierScheduleShift = app.selectedCourierScheduleShiftValues?.[FIRST_CHECKOUT_ORDER_ID]?.value;
      if (firstOrderSelectedCourierScheduleShift) setSelectedCourierScheduleShift(firstOrderSelectedCourierScheduleShift);
    }
  }, [isRadiogroupDirty, id, isMultiple, app.selectedCourierScheduleShiftValues]);
}

export default useAutoFillingNotFirstDeliverySection