import { useEffect } from "react";

function useClosingFiltersBarEmptyValue(filters, isVisibleFiltersSidebar, closeFiltersSidebar) {
  // closing filters sidebar if its value is empty (filters object is empty)
  useEffect(() => {
    if (filters) {
      if (!Object.keys(filters).length && isVisibleFiltersSidebar) {
        closeFiltersSidebar();
      }
    }

    // eslint-disable-next-line
  }, [filters, isVisibleFiltersSidebar])
}

export default useClosingFiltersBarEmptyValue;