import { useEffect } from "react";

function useWindowInvisibleFocus(elemToFocusRef, isVisible = true, changingValueToReuse = null) {
  useEffect(() => {
    console.log(elemToFocusRef.current);
    if (elemToFocusRef.current && isVisible) {
      elemToFocusRef.current.classList.add("invisible-focus");
      elemToFocusRef.current.addEventListener("blur", () => {
        elemToFocusRef.current?.classList.remove("invisible-focus");
      });
      
      elemToFocusRef.current.focus();
    }

  }, [elemToFocusRef, isVisible, changingValueToReuse]);
}

export default useWindowInvisibleFocus;