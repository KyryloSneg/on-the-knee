import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/FiltersAside.css";
import FilterCategories from "./FilterCategories";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { useLocation } from "react-router-dom";
import URLActions from "../utils/URLActions";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import getAllFocusableElements from "../utils/getAllFocusableElements";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";

const FiltersAside = observer(() => {
  const { deviceStore, app, isTest } = useContext(Context);
  const asideRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigateToEncodedURL();

  let deviceSectionElemToFocus;
  let asideElemToFocus;

  if (app.deviceSectionRef?.current) {
    deviceSectionElemToFocus = getAllFocusableElements(app.deviceSectionRef.current)[0];
  }

  if (app.filtersAsideRef?.current) {
    // getting element with index "1" because we do not want focusing 
    // "skip to the next page section" button at the start of aside bar
    asideElemToFocus = getAllFocusableElements(app.filtersAsideRef.current)[1];
  }

  useEffect(() => {
    app.setFiltersAsideRef(asideRef);
  }, [app, deviceStore.filters, deviceStore.usedFilters]);

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

  }, [location.search, deviceStore, deviceStore.filters, deviceStore.filters, location.pathname, navigate, isTest]);

  return (
    <aside className="filters-aside" ref={asideRef}>
      <SkipToNextPageContent
        title="skip to the device section"
        elemToFocus={deviceSectionElemToFocus}
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
        elemToFocus={asideElemToFocus}
        testId="skip-to-the-next-page-btn aside end"
        className="w-100"
      />
    </aside>
  );
});

export default FiltersAside;