import { useEffect } from "react";

export default function useSetSelectingSearchId(minId, setSelectedId, backupValue) {
  useEffect(() => {
    if (minId !== null) {

      if (backupValue) {
        setSelectedId(minId);
      } else {
        // creating a little offset for our next useEffect hook
        setSelectedId(minId - 1);
      }

    }
  }, [minId, setSelectedId, backupValue]);
}