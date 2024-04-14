import { useEffect } from "react";

export default function useSearchResultControl(selectedId, setSelectedId, minIdRef, maxIdRef, backupValue, setValue, isInputFocused, isFocused, results) {
  useEffect(() => {
    function onKeyDown(e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();

          if (minIdRef.current === maxIdRef.current) {
            return;
          } else if (selectedId === maxIdRef.current) {
            setSelectedId(minIdRef.current);
          } else {
            setSelectedId(selectedId + 1);
          }

          break;
        case "ArrowUp":
          e.preventDefault();

          if (minIdRef.current === maxIdRef.current) {
            return;
          } else if (selectedId === minIdRef.current) {
            setSelectedId(maxIdRef.current);
          } else {
            setSelectedId(selectedId - 1);
          }

          break;
        default:
          break;
      }
    }

    // if our controls aren't disabled
    if (selectedId !== null) {
      // if input and the form itself are focused
      if (isInputFocused && isFocused) {
        window.addEventListener("keydown", onKeyDown);
      } 
      // else {
      //   setValue(backupValue);
      // }
    }
    
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [selectedId, setSelectedId, minIdRef, maxIdRef, backupValue, setValue, isInputFocused, isFocused, results]);
}