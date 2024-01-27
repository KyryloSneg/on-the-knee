import { useEffect } from "react";
import setCategoriesModalVisibility from "../utils/setCategoriesModalVisibility";
import { WIDTH_TO_SHOW_CATEGORIES_MENU } from "../utils/consts";

function useClosingCategoriesModalWidth(windowWidth, isVisibleCategoriesModal, app) {
  // if the window width after rotate is (>= WIDTH_TO_SHOW_CATEGORIES_MENU)
  useEffect(() => {
    if (windowWidth >= WIDTH_TO_SHOW_CATEGORIES_MENU && isVisibleCategoriesModal) {
      setCategoriesModalVisibility(false, app);
    }
  }, [windowWidth, isVisibleCategoriesModal, app]);
}

export default useClosingCategoriesModalWidth;