import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";

// source: https://www.developerway.com/posts/debouncing-in-react
export default function useLodashDebounce(callback, delay) {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return _.debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};