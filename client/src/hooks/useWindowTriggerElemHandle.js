const { useEffect, useContext } = require("react");
const { Context } = require("../Context");

function useWindowTriggerElemHandle(triggerElemRef, id, isToFocusTriggerElem = true) {
  const { app } = useContext(Context);

  useEffect(() => {
    if (isToFocusTriggerElem) {
      if (triggerElemRef?.current && app.isToSetLastBtnRefInCurrWindow) app.setLastWindowBtnRef(triggerElemRef);

      return () => {
        app.lastWindowBtnRef?.current?.focus();
      };
    }
  }, [app, triggerElemRef, isToFocusTriggerElem]);

  useEffect(() => {
    // reminder for myself
    if (!triggerElemRef && isToFocusTriggerElem) console.log(`Provide triggerElemRef for ${id} window`);
  }, [triggerElemRef, id, isToFocusTriggerElem]);
}

export default useWindowTriggerElemHandle;