import { useEffect } from "react";
import { WIDTH_TO_SHOW_ASIDE } from "../utils/consts";

function useClosingUsedFiltersBarWidth(windowWidth, isVisibleUsedFiltersSidebar, closeUsedFiltersSidebar) {
  // closing filters sidebar on rotating mobile phone
  // if the window width after rotate is (>= WIDTH_TO_SHOW_ASIDE)
  useEffect(() => {
    if (windowWidth >= WIDTH_TO_SHOW_ASIDE && isVisibleUsedFiltersSidebar) {
      closeUsedFiltersSidebar();
    }
  }, [windowWidth, closeUsedFiltersSidebar, isVisibleUsedFiltersSidebar]);
}

export default useClosingUsedFiltersBarWidth;