import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/Aside.css";
import FilterCategories from "./FilterCategories";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { useLocation, useNavigate } from "react-router-dom";
import URLActions from "../utils/URLActions";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";

const Aside = observer(() => {
  const { deviceStore, app, isTest } = useContext(Context);
  const asideBeginningRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    app.setAsideBeginningRef(asideBeginningRef);
  }, [app]);

  useEffect(() => {
    const { usedFilters, url } = URLActions.getUsedFilters(deviceStore.filters);
    deviceStore.setUsedFilters(usedFilters);

    // if the url changed (for example if there's some not existing key or value)
    // we change it to normal one without redundant query params

    // router from the tests seems to not work with navigate() function,
    // so it's better to skip the block below
    if (location.pathname !== url && !isTest) {
      const basename = process.env.REACT_APP_CLIENT_URL;
      navigate(url.replace(basename, ""), { replace: true });
    }
  }, [location.search, deviceStore, navigate, location.pathname, isTest]);

  return (
    <aside>
      <SkipToNextPageContent 
        title="skip to the device section" 
        toFocusRef={app.deviceSectionRef} 
        testId="skip-to-the-next-page-btn aside start"
        className="w-100"
      />
      {Object.keys(deviceStore.usedFilters).length > 0 
        ? [
          <UsedFilters key={"usedFiltersSection"} />,
          <FilterCategories key={"filterCategoriesSection"} />
        ]
        : (
          <FilterCategories />
        )
      }
      <SkipToNextPageContent 
        title="skip to the filter bar beginning" 
        toFocusRef={app.asideBeginningRef} 
        testId="skip-to-the-next-page-btn aside end"
        className="w-100"
      />
    </aside>
  );
});

export default Aside;
