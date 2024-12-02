import "./styles/DeliverySectionCourierOptionScheduleItem.css";
import getDateStr from '../utils/getDateStr';
import getWeekDay from "../utils/getWeekDay";
import getDatetime from "utils/getDatetime";

const DeliverySectionCourierOptionScheduleItem = ({ 
  setIsDirty, schedule, selectedCourierScheduleId, setSelectedCourierScheduleId, 
  selectedCourierScheduleShift, setSelectedCourierScheduleShift
}) => {
  const date = new Date(schedule.date);
  const dateStr = getDateStr(date, "MMM Do");
  const datetime = getDatetime(date);

  const weekDay = getWeekDay(date);

  return (
    <dl className="delivery-section-courier-option-schedule-item">
      <dt>
        <span>
          <time dateTime={datetime}><b>{dateStr}</b></time> ({weekDay})
        </span>
      </dt>
      {Object.entries(schedule.shifts)?.map(([number, shift]) => {
        let btnClassName = "courier-schedule-shift-btn"

        const isChecked = schedule.id === selectedCourierScheduleId && number === selectedCourierScheduleShift;
        if (isChecked) {
          btnClassName += " checked";
        }

        const startTimeDate = new Date(shift.startTime);
        const endTimeDate = new Date(shift.endTime);
        
        const startTimeStr = getDateStr(startTimeDate, "hh:mm A");
        const endTimeStr = getDateStr(endTimeDate, "hh:mm A");

        function onClick() {
          setSelectedCourierScheduleId(schedule.id);
          setSelectedCourierScheduleShift(number);

          setIsDirty(true);
        }

        return (
          <dd key={`${schedule.id}-${number}`}>
            <button
              type="button"
              role="radio"
              aria-checked={isChecked}
              onClick={onClick}
              className={btnClassName}
            >
              {startTimeStr} - {endTimeStr}
            </button>
          </dd>
        );
      })}
    </dl>
  );
}

export default DeliverySectionCourierOptionScheduleItem;
