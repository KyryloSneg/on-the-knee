import { useEffect } from "react";
import { WIDTH_TO_SHOW_CATEGORIES_MENU } from "../utils/consts";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";

function useClosingCategoriesMenuWidth(windowWidth, isVisibleCategoriesMenu, app) {
  // if the window width after rotate is (>= WIDTH_TO_SHOW_CATEGORIES_MENU)
  useEffect(() => {
    if (windowWidth < WIDTH_TO_SHOW_CATEGORIES_MENU && isVisibleCategoriesMenu) {
      setCategoriesMenuVisibility(false, app);
    }
  }, [windowWidth, isVisibleCategoriesMenu, app]);
}

export default useClosingCategoriesMenuWidth;