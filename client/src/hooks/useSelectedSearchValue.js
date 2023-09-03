import { useEffect } from "react";

export default function useSelectedSearchValue(selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef) {
  useEffect(() => {
    let resultValue;

    // if any of search results isn't focused
    if (!searchResultsRef.current.contains(document.activeElement)) {
      if (minId !== null) {
        // if selected id hasn't changed
        // we check if our selected search is our backup value
        if (selectedId <= minId) {
          resultValue = backupValue;
        } else {
          // else we change our value to other selected search
          const result =
            results.default.find(res => res.id === selectedId) ||
            results.categories.find(res => res.id === selectedId) ||
            results.history.find(res => res.id === selectedId);
          resultValue = result.value;
        }

        setValue(resultValue);
      }
    }

  }, [selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef]);
}