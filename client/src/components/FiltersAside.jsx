import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/FiltersAside.css";
import FilterCategories from "./FilterCategories";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import getAllFocusableElements from "../utils/getAllFocusableElements";

const FiltersAside = observer(() => {
  const { deviceStore, app } = useContext(Context);
  const asideRef = useRef(null);

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
