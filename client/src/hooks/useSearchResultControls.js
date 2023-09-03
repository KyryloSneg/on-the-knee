import { useEffect } from "react";
import findResultId from "../utils/findResultId";

export default function useSearchResultControl(selectedId, setSelectedId, minId, maxId, backupValue, setValue, isInputFocused, isFocused, results) {
  useEffect(() => {
    function onKeyDown(e) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();

          if (selectedId === maxId) {
            setSelectedId(minId);
          } else {
            const nextSelectedId = findResultId(results, selectedId);
            setSelectedId(nextSelectedId);
          }
          break;
        case "ArrowUp":
          e.preventDefault();

          // our minId is always less than minimum search's id by 1
          if (selectedId === minId + 1) {
            setSelectedId(minId);
          } else if (selectedId === minId) {
            setSelectedId(maxId);
          } else {
            const nextSelectedId = findResultId(results, selectedId, "previous");
            setSelectedId(nextSelectedId);
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
        
        // if our backup value search option is hidden we unblock it
        if (selectedId === minId - 1 && backupValue) {
          setSelectedId(minId);
        } else if (selectedId === minId - 2 && !backupValue) {
          setSelectedId(minId - 1)
        }
  
      } else {
        setValue(backupValue);
        // hide out backup value search option
        if (!backupValue) {
          setSelectedId(minId - 2);
        } else {
          setSelectedId(minId - 1);
        }
      }
    }
    
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [selectedId, setSelectedId, minId, maxId, backupValue, setValue, isInputFocused, isFocused, results]);
}