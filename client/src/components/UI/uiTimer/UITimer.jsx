import "./UITimer.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DateActions from "utils/DateActions";

// it's better to use timer with aria-label or aria-labelledby attr
const UITimer = ({ deadlineDate, ...props }) => {
  const getTimerData = useCallback((propsSetTimerData = null) => {
    let result = null;

    const dateNow = new Date();
    const diffInMs = DateActions.getDateDiffInMs(dateNow, deadlineDate);
    
    // >= 1s
    if (diffInMs >= 1000) {
      const humanReadableTime = DateActions.msToDaysHoursMinutesSecondsAndMs(diffInMs);
      result = { 
        days: humanReadableTime.days, 
        hours: humanReadableTime.hours, 
        minutes: humanReadableTime.minutes,
        seconds: humanReadableTime.seconds 
      };
    } else {
      result = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    propsSetTimerData?.(result);
    return result;
  }, [deadlineDate]);

  const initialTimerData = useMemo(() => getTimerData(), [getTimerData]);
  const [timerData, setTimerData] = useState(initialTimerData);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      const result = getTimerData(setTimerData);
      if (!result.days && !result.hours && !result.minutes && !result.seconds) {
        // stop the timer
        if (intervalIdRef.current !== null) clearInterval(intervalIdRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [getTimerData]);

  let timerDataWithFormattedValues = {};
  for (let [key, value] of Object.entries(timerData)) {
    timerDataWithFormattedValues[key] = DateActions.getDatePartWithPossibleZeros(value, 2);
  }

  const days = timerDataWithFormattedValues.days;
  const hours = timerDataWithFormattedValues.hours;
  const minutes = timerDataWithFormattedValues.minutes;
  const seconds = timerDataWithFormattedValues.seconds;

  return (
    <div className="ui-timer" role="timer" {...props}>
      <div className="ui-timer-time-part">
        <span className="ui-timer-time-part-number">{days}</span>
        <span className="ui-timer-time-part-word">
          {days === 1 ? "day" : "days"}
        </span>
      </div>
      <span className="ui-timer-separator" aria-hidden="true">:</span>
      <div className="ui-timer-time-part">
        <span className="ui-timer-time-part-number">{hours}</span>
        <span className="ui-timer-time-part-word">
          {hours === 1 ? "hour" : "hours"}
        </span>
      </div>
      <span className="ui-timer-separator" aria-hidden="true">:</span>
      <div className="ui-timer-time-part">
        <span className="ui-timer-time-part-number">{minutes}</span>
        <span className="ui-timer-time-part-word">
          {minutes === 1 ? "minute" : "minutes"}
        </span>
      </div>
      <span className="ui-timer-separator" aria-hidden="true">:</span>
      <div className="ui-timer-time-part">
        <span className="ui-timer-time-part-number">{seconds}</span>
        <span className="ui-timer-time-part-word">
          {seconds === 1 ? "second" : "seconds"}
        </span>
      </div>
    </div>
  );
}

export default UITimer;