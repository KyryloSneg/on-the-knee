import { useEffect } from "react";

// the hook below is used when we need to execute some function
// on clicking anything else than elem and btnOfElem (if we have one)

// btnOfElem - the button that opens up our elem
export default function useClickOnEverything(func, elemRef, btnOfElemRef = null) {
  function effectFn() {
    if (func) {

      function clickHandler(e) {
        if (!!btnOfElemRef?.current && e.target === btnOfElemRef?.current) return;

        if (elemRef.current && !elemRef.current?.contains(e.target)) {
          func();
          document.body.removeEventListener("click", clickHandler);
        }

      }

      // doing this, so it, for example, doesn't close window immediately after opening it
      setTimeout(() => {
        document.body.addEventListener("click", clickHandler);
      }, 0);
  
      return () => {
        document.body.removeEventListener("click", clickHandler);
      }
    }
  }
  
  useEffect(effectFn, [func, elemRef, btnOfElemRef, effectFn])
}