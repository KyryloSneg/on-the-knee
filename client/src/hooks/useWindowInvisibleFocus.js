import { useEffect } from "react";

function useWindowInvisibleFocus(elemToFocusRef) {
  useEffect(() => {
    if (elemToFocusRef.current) {
      elemToFocusRef.current.classList.add("invisible-focus");
      elemToFocusRef.current.addEventListener("blur", () => {
        elemToFocusRef.current?.classList.remove("invisible-focus");
      });
  
      elemToFocusRef.current.focus();
    }

  }, [elemToFocusRef]);
}

export default useWindowInvisibleFocus;