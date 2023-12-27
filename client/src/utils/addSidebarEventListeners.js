import addOneTimeEventListener from "./addOneTimeEventListener";

export function addListenerOnCloseFrameEnd(sidebar, isRunningClosingAnimRef) {
  function onClosingFrameEnd() {
    isRunningClosingAnimRef.current = true;
  }

  // we can't use "jsAnimationRun" event because it has already dispatched at the moment of adding the listener
  addOneTimeEventListener(sidebar, "jsFrameEnd-closing", onClosingFrameEnd);
}

export function addListenerOnCloseAnimationEnd(sidebar, closeSidebar, isRunningClosingAnimRef) {
  function onClosingAnimationEnd() {
    closeSidebar();
    isRunningClosingAnimRef.current = false;
  }

  addOneTimeEventListener(sidebar, "jsAnimationEnd-closing", onClosingAnimationEnd);
}