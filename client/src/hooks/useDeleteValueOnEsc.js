import { useEffect } from "react";

export default function useDeleteValueOnEsc(setValue, setBackupValue, isFocused) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === "Escape") {
        setValue("");
        setBackupValue("");
      }
    }
    
    if (isFocused) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    }
  }, [setValue, setBackupValue, isFocused]);
}