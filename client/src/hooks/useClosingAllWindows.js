import { useContext, useEffect } from "react";
import setCategoriesModalVisibility from "../utils/setCategoriesModalVisibility";
import setCategoriesMenuVisibility from "../utils/setCategoriesMenuVisibility";
import { Context } from "../Context";
import setMenuVisibility from "../utils/setMenuVisibility";
import setFiltersSidebarVisibility from "../utils/setFiltersSidebarVisibility";
import setUsedFiltersBarVisibility from "../utils/setUsedFiltersBarVisibility";
import { useLocation } from "react-router-dom";

function useClosingAllWindows() {
  const location = useLocation();
  const { app } = useContext(Context);

  // TODO: close every new modal window / sidebar / maybe even new menu that causes dark bg appearing
  useEffect(() => {
    setCategoriesModalVisibility(false, app);
    setCategoriesMenuVisibility(false, app);
    setMenuVisibility(false, app);
    setFiltersSidebarVisibility(false, app);
    setUsedFiltersBarVisibility(false, app);

    app.setDarkBgVisible(false, app);
    app.setIsBlockedScroll(false, app);
  }, [app, location]);
}

export default useClosingAllWindows;