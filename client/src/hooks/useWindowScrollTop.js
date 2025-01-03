import { useState, useEffect, useRef } from "react";

export default function useWindowScrollTop() {
  const [scrollTop, setScrollTop] = useState(document.documentElement.scrollTop);
  const prevScrollTopRef = useRef(null);

  useEffect(() => {
    function scrollHandler() {
      const nextScrollTop = document.documentElement.scrollTop;

      // we can't do this inside a component, because react in dev build 
      // checks the purity of one and calls the assignment below twice,
      // so prevScrollTopRef.current === scrollTop on the second call
      setScrollTop(nextScrollTop);
      prevScrollTopRef.current = scrollTop;
    }

    window.addEventListener("scroll", scrollHandler)
    return () => {
      window.removeEventListener("scroll", scrollHandler)
    }
  }, [scrollTop]);

  return { windowScrollTop: scrollTop, prevWindowScrollTopRef: prevScrollTopRef };
}