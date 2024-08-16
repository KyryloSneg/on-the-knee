import "./styles/DeliverySectionCourierOption.css";
import DeliverySectionCourierOptionInputs from "./DeliverySectionCourierOptionInputs";
import DeliverySectionCourierOptionSchedules from "./DeliverySectionCourierOptionSchedules";
import getDateStr from "../utils/getDateStr";
import { useContext } from "react";
import { Context } from "../Context";
import getWeekDay from "../utils/getWeekDay";
import { observer } from "mobx-react-lite";

const DeliverySectionCourierOption = observer(({
  register, errors, watch, hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor,
  selectedCourierScheduleId, setSelectedCourierScheduleId, selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const { app } = useContext(Context);

  const selectedDelivery = app.deliveries?.find(delivery => delivery.id === app.selectedDeliveryId);
  const selectedSchedule = selectedDelivery?.["courier-schedules"]?.find(schedule => schedule.id === selectedCourierScheduleId);
  const selectedShift = selectedSchedule?.shifts?.[selectedCourierScheduleShift];

  let selectedScheduleDateStr;
  let startTimeDateStr;
  let endTimeDateStr;

  let weekDay;

  if (selectedSchedule && selectedShift) {
    selectedScheduleDateStr = getDateStr(new Date(selectedSchedule?.date), "MMM Do");
    startTimeDateStr = getDateStr(new Date(selectedShift?.startTime), "hh:mm A", false);
    endTimeDateStr = getDateStr(new Date(selectedShift?.endTime), "hh:mm A", false);

    weekDay = getWeekDay(new Date(selectedSchedule?.date));
  }

  return (
    <div className="delivery-section-courier-option">
      {(selectedSchedule && selectedShift) &&
        <p className="selected-delivery-msg">
          <strong>
            Delivery from {selectedScheduleDateStr} {startTimeDateStr} - {endTimeDateStr} ({weekDay})
          </strong>
        </p>
      }
      <DeliverySectionCourierOptionInputs
        register={register}
        errors={errors}
        watch={watch}
        hasElevator={hasElevator}
        setHasElevator={setHasElevator}
        isToLiftOnTheFloor={isToLiftOnTheFloor}
        setIsToLiftOnTheFloor={setIsToLiftOnTheFloor} 
      />
      <DeliverySectionCourierOptionSchedules 
        selectedCourierScheduleId={selectedCourierScheduleId}
        setSelectedCourierScheduleId={setSelectedCourierScheduleId}
        selectedCourierScheduleShift={selectedCourierScheduleShift}
        setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
      />
    </div>
  );
});

export default DeliverySectionCourierOption;