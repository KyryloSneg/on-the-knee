import { useEffect } from "react";

function useBlockingScroll(isBlockedScroll) {
  useEffect(() => {
    if (isBlockedScroll) {
      // setting left and top css properties to not reset current page scroll
      document.body.style.left = window.scrollX + "px";
      document.body.style.top = -(window.scrollY) + "px";
      document.body.classList.add("global-blocked-scroll");
    } else {
      const left = +document.body.style.left.replace("px", "");
      const top = +document.body.style.top.replace("px", "");

      document.body.style.removeProperty("left");
      document.body.style.removeProperty("top");
      document.body.classList.remove("global-blocked-scroll");
      window.scrollTo({
        left: left,
        top: -top,
      });
    }
  }, [isBlockedScroll])
}

export default useBlockingScroll;