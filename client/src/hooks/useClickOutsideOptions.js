import { useEffect } from "react";

export default function useClickOutsideOptions(hide) {
  useEffect(() => {
    function clickHandler() {
      hide?.();
    }

    window.addEventListener("click", clickHandler);
    return () => {
      window.removeEventListener("click", clickHandler);
    }
  });
}