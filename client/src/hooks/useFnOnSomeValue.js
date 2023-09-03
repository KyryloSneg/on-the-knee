import { useEffect } from "react";

export default function useFnOnSomeValue(value, func = null, onEmptyFunc = null) {
  useEffect(() => {
    // if the value isn't empty call a function
    if (value && !!func) {
      func();
    } else if (!value && !!onEmptyFunc) {
      onEmptyFunc();
    }

  }, [value, func, onEmptyFunc])
}