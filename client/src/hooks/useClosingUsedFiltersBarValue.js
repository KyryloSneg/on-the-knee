import { useEffect } from "react";

function useClosingUsedFiltersBarValue(usedFilters, isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar) {
  // closing filters sidebar if its value is empty (filters object is empty)
  useEffect(() => {
    if (usedFilters) {
      if (!Object.keys(usedFilters).length && isVisibleUsedFiltersSidebar) {
        closeUsedFiltersSidebar();
      }
    }

    // eslint-disable-next-line
  }, [usedFilters, isVisibleUsedFiltersSidebar])
}

export default useClosingUsedFiltersBarValue;