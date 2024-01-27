import { useEffect } from "react";
import getAllFocusableElements from "../utils/getAllFocusableElements";

function useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, containerElemRef, firstElemIndex = 1, lastElemIndex = -2) {
  useEffect(() => {
    const firstFocusTrap = firstFocusTrapRef.current;
    const lastFocusTrap = lastFocusTrapRef.current;

    function focusLastElem() {
      if (!containerElemRef?.current) return; 

      const allFocusableElems = getAllFocusableElements(containerElemRef.current);
      // do not include the last focus trap
      const lastElem = allFocusableElems[allFocusableElems.length + lastElemIndex];
      lastElem?.focus();
    }

    function focusFirstElem() {
      if (!containerElemRef?.current) return;

      const allFocusableElems = getAllFocusableElements(containerElemRef.current);
      // do not include the first focus trap
      const firstElem = allFocusableElems[firstElemIndex];
      firstElem?.focus();
    }

    firstFocusTrap.addEventListener("focus", focusLastElem);
    lastFocusTrap.addEventListener("focus", focusFirstElem);

    return () => {
      firstFocusTrap.removeEventListener("focus", focusLastElem);
      lastFocusTrap.removeEventListener("focus", focusFirstElem);
    }
  }, [firstFocusTrapRef, lastFocusTrapRef, containerElemRef, firstElemIndex, lastElemIndex]);
}

export default useFocusTraps;