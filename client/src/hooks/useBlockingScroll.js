import { useEffect } from "react";
import getScrollHeight from "utils/getScrollHeight";

function useBlockingScroll(isBlockedScroll) {
  useEffect(() => {
    const isPageWithScroll = getScrollHeight() !== document.documentElement.clientHeight;

    if (isBlockedScroll) {
      // setting left and top css properties to not reset current page scroll
      document.body.style.left = window.scrollX + "px";
      document.body.style.top = -(window.scrollY) + "px";

      document.body.classList.add("global-blocked-scroll");
      if (isPageWithScroll) document.body.classList.add("scroll-y");
    } else {
      const left = +document.body.style.left.replace("px", "");
      const top = +document.body.style.top.replace("px", "");

      document.body.style.removeProperty("left");
      document.body.style.removeProperty("top");

      document.body.classList.remove("global-blocked-scroll");
      document.body.classList.remove("scroll-y");

      window.scrollTo({
        left: left,
        top: -top,
      });
    }
  }, [isBlockedScroll])
}

export default useBlockingScroll;