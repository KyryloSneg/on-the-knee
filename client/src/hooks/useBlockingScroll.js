import { useEffect } from "react";

function useBlockingScroll(isBlockedScroll) {
  useEffect(() => {
    if (isBlockedScroll) {
      document.body.classList.add("global-blocked-scroll");
    }

    return () => {
      document.body.classList.remove("global-blocked-scroll");
    }
  }, [isBlockedScroll])
}

export default useBlockingScroll;