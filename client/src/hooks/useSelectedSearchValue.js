import { useEffect } from "react";

export default function useSelectedSearchValue(selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef) {
  useEffect(() => {
    let resultValue;

    // if any of search results isn't focused
    if (!searchResultsRef.current.contains(document.activeElement)) {
      if (minId.current !== null && selectedId !== null) {
        // if selected id hasn't changed
        // we check if our selected search is our backup value
        if (selectedId === minId.current) {
          resultValue = backupValue;
        } else {
          // else we change our value to other selected search
          const searchResultElems = document.body.getElementsByClassName("search-result");

          if (searchResultElems.length) {
            const selectedSearchResult = searchResultElems[selectedId - 1];
            const selectedSearchType = selectedSearchResult.dataset.type
            const isSelectable = selectedSearchType === "hint" || selectedSearchType === "history";

            if (isSelectable) resultValue = selectedSearchResult.dataset.value;
          }
        }

        if (resultValue !== undefined) setValue(resultValue);
      }
    }

  }, [selectedId, setSelectedId, results, setValue, minId, backupValue, searchResultsRef]);
}