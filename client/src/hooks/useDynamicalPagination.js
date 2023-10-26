import { useEffect, useRef } from "react";

export const useDynamicalPagination = (ref, canLoad, isLoading, callback) => {
  const observer = useRef();

  useEffect(() => {
    if (!ref.current) return;
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    const cb = function (entries, observer) {
      if (entries[0].isIntersecting && canLoad) {
        callback()
      }
    };
    observer.current = new IntersectionObserver(cb);
    observer.current.observe(ref.current)
  }, [isLoading, canLoad])
}