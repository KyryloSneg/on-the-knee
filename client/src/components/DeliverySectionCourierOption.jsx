import "./styles/DeliverySectionCourierOption.css";
import DeliverySectionCourierOptionInputs from "./DeliverySectionCourierOptionInputs";
import DeliverySectionCourierOptionSchedules from "./DeliverySectionCourierOptionSchedules";
import getDateStr from "../utils/getDateStr";
import { useContext } from "react";
import { Context } from "../Context";
import getWeekDay from "../utils/getWeekDay";
import { observer } from "mobx-react-lite";

const DeliverySectionCourierOption = observer(({
  order, inputsId, setIsDirty, register, errors, control, selectedDeliveryId, hasElevator, setHasElevator, 
  isToLiftOnTheFloor, setIsToLiftOnTheFloor, selectedCourierScheduleId, setSelectedCourierScheduleId, 
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const { app } = useContext(Context);

  const isPreOrderCombos = order.types.includes("preOrder");
  const areMultipleDevicesInOrder = !!order.value?.length;

  let selectedSchedule;
  let selectedShift;

  let selectedScheduleDateStr;
  let startTimeDateStr;
  let endTimeDateStr;

  let weekDay;

  if (!isPreOrderCombos) {
    const selectedDelivery = app.deliveries?.find(delivery => delivery.id === selectedDeliveryId);
    selectedSchedule = selectedDelivery?.["courier-schedules"]?.find(schedule => schedule.id === selectedCourierScheduleId);
    selectedShift = selectedSchedule?.shifts?.[selectedCourierScheduleShift];
  
    if (selectedSchedule && selectedShift) {
      selectedScheduleDateStr = getDateStr(new Date(selectedSchedule?.date), "MMM Do");
      startTimeDateStr = getDateStr(new Date(selectedShift?.startTime), "hh:mm A", false);
      endTimeDateStr = getDateStr(new Date(selectedShift?.endTime), "hh:mm A", false);
  
      weekDay = getWeekDay(new Date(selectedSchedule?.date));
    }
  }

  return (
    <div className="delivery-section-courier-option">
      {(selectedSchedule && selectedShift && !isPreOrderCombos) &&
        <p className="selected-delivery-msg">
          <strong>
            Delivery from {selectedScheduleDateStr} {startTimeDateStr} - {endTimeDateStr} ({weekDay})
          </strong>
        </p>
      }
      <DeliverySectionCourierOptionInputs
        inputsId={inputsId}
        register={register}
        errors={errors}
        control={control}
        hasElevator={hasElevator}
        setHasElevator={setHasElevator}
        isToLiftOnTheFloor={isToLiftOnTheFloor}
        setIsToLiftOnTheFloor={setIsToLiftOnTheFloor} 
      />
      {isPreOrderCombos
        ? (
          <div className="delivery-section-courier-preorder-msg">
            <p>
              Our manager will contact the receivent when the pre-order {areMultipleDevicesInOrder ? "devices" : "device"} will 
              come out to discuss the time when the courier will deliver this order
            </p>
          </div>
        ) 
        : (
          <DeliverySectionCourierOptionSchedules 
            setIsDirty={setIsDirty}
            selectedDeliveryId={selectedDeliveryId}
            selectedCourierScheduleId={selectedCourierScheduleId}
            setSelectedCourierScheduleId={setSelectedCourierScheduleId}
            selectedCourierScheduleShift={selectedCourierScheduleShift}
            setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
          />
        )
      }
    </div>
  );
});

export default DeliverySectionCourierOption;