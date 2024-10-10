import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";

// use trailing false to prevent invoking the callback twice after double click within delay
export default function useLodashThrottle(callback, delay, options = {}) {
  const cbRef = useRef();
  const optionsRef = useRef(options);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const throttledCallback = useMemo(() => {
    const func = (...args) => {
      cbRef.current?.(...args);
    };

    return _.throttle(func, delay, optionsRef.current);
  }, [delay]);

  return throttledCallback;
};