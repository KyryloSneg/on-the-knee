import "./styles/DeliverySectionCourierOptionSchedules.css";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import DeliverySectionCourierOptionScheduleItem from "./DeliverySectionCourierOptionScheduleItem";

const DeliverySectionCourierOptionSchedules = observer(({ 
  selectedCourierScheduleId, setSelectedCourierScheduleId, selectedCourierScheduleShift, setSelectedCourierScheduleShift 
}) => {
  const { app } = useContext(Context);

  const selectedDelivery = app.deliveries?.find(delivery => delivery.id === app.selectedDeliveryId);
  return (
    <ul className="delivery-section-courier-option-schedules" role="radiogroup">
      {selectedDelivery["courier-schedules"]?.map(schedule => 
        <li key={schedule.id}>
          <DeliverySectionCourierOptionScheduleItem 
            schedule={schedule}
            selectedCourierScheduleId={selectedCourierScheduleId}
            setSelectedCourierScheduleId={setSelectedCourierScheduleId}
            selectedCourierScheduleShift={selectedCourierScheduleShift}
            setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
          />
        </li>
      )}
    </ul>
  );
});

export default DeliverySectionCourierOptionSchedules;
