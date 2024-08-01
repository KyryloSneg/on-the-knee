const { useEffect, useContext } = require("react");
const { Context } = require("../Context");

function useWindowTriggerElemHandle(triggerElemRef, id) {
  const { app } = useContext(Context);

  useEffect(() => {
    if (triggerElemRef?.current && app.isToSetLastBtnRefInCurrWindow) app.setLastWindowBtnRef(triggerElemRef);
    return () => {
      app.lastWindowBtnRef?.current?.focus();
    };
  }, [app, triggerElemRef]);

  useEffect(() => {
    // reminder for myself
    if (!triggerElemRef) console.log(`Provide triggerElemRef for ${id} window`);
  }, [triggerElemRef, id]);
}

export default useWindowTriggerElemHandle;