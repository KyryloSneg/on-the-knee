import { useContext, useEffect } from "react"
import { Context } from "../Context";

function useSettingInitialSelectedScheduleId(setScheduleId, setShift) {
  const { app } = useContext(Context);

  useEffect(() => {
    if (app.deliveries?.length) {
      const delivery = app.deliveries?.find(delivery => delivery.name === "courier");
      const schedule = delivery?.["courier-schedules"]?.[0];

      if (schedule) {
        setScheduleId(schedule.id);
        const shift = Object.keys(schedule?.shifts)[0];

        if (shift) {
          setShift(shift);
        }
      }
    }
  }, [app.deliveries, setScheduleId, setShift]);
}

export default useSettingInitialSelectedScheduleId