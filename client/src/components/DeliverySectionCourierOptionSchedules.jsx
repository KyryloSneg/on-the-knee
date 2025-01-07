import "./styles/DeliverySectionCourierOptionSchedules.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import DeliverySectionCourierOptionScheduleItem from "./DeliverySectionCourierOptionScheduleItem";

const DeliverySectionCourierOptionSchedules = observer(({
  setIsDirty, selectedDeliveryId, selectedCourierScheduleId, setSelectedCourierScheduleId,
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const { app } = useContext(Context);

  const selectedDelivery = app.deliveries?.find(delivery => delivery.id === selectedDeliveryId);
  return (
    <div className="delivery-section-courier-option-schedules" role="radiogroup">
      {selectedDelivery["courier-schedules"]?.map(schedule =>
        <DeliverySectionCourierOptionScheduleItem
          key={schedule.id}
          setIsDirty={setIsDirty}
          schedule={schedule}
          selectedCourierScheduleId={selectedCourierScheduleId}
          setSelectedCourierScheduleId={setSelectedCourierScheduleId}
          selectedCourierScheduleShift={selectedCourierScheduleShift}
          setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
        />
      )}
    </div>
  );
});

export default DeliverySectionCourierOptionSchedules;
