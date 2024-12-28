import UsedFilters from "./UsedFilters";
import { observer } from "mobx-react-lite";
import "./styles/FiltersAside.css";
import FilterCategories from "./FilterCategories";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import SkipToNextPageContent from "./UI/skipToNextPageContent/SkipToNextPageContent";
import getAllFocusableElements from "../utils/getAllFocusableElements";

// type from the catalog page
const FiltersAside = observer(({ storeToUse }) => {
  const { app } = useContext(Context);
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
  }, [app, storeToUse.filters, storeToUse.usedFilters]);

  return (
    <aside className="filters-aside" ref={asideRef}>
      <SkipToNextPageContent
        title="skip to the device section"
        elemToFocus={deviceSectionElemToFocus}
        testId="skip-to-the-next-page-btn aside start"
        className="w-100"
      />
      {Object.keys(storeToUse.usedFilters).length > 0
        ? [
          <UsedFilters key={"usedFiltersSection"} storeToUse={storeToUse} />,
          <FilterCategories key={"filterCategoriesSection"} storeToUse={storeToUse} />
        ]
        : (
          <FilterCategories storeToUse={storeToUse} />
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
