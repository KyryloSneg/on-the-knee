import { useEffect } from "react";
import { WIDTH_TO_SHOW_ASIDE } from "../utils/consts";

function useClosingFiltersSidebarWidth(windowWidth, isVisibleFiltersSidebar, closeFiltersSidebar) {
  // closing filters sidebar on rotating mobile phone
  // if the window width after rotate is (>= WIDTH_TO_SHOW_ASIDE)
  useEffect(() => {
    if (windowWidth >= WIDTH_TO_SHOW_ASIDE && isVisibleFiltersSidebar) {
      closeFiltersSidebar();
    }
  }, [windowWidth, closeFiltersSidebar, isVisibleFiltersSidebar]);
}

export default useClosingFiltersSidebarWidth;