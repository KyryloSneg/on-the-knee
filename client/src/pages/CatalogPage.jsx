import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import Aside from "../components/Aside";
import "./styles/CatalogPage.css";
import useWindowWidth from "../hooks/useWindowWidth";
import DeviceSection from "../components/DeviceSection";
import { DEVICE_ITEMS_DESKTOP_LIMIT, DEVICE_ITEMS_MOBILE_LIMIT, WIDTH_TO_SHOW_ASIDE, sortingOptions } from "../utils/consts";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useClosingAllWindows from "../hooks/useClosingAllWindows";

const CatalogPage = () => {
  const { deviceStore, app } = useContext(Context);
  const pageRef = useRef(null);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app, windowWidth]);

  useEffect(() => {
    if (windowWidth > 820) {
      if (deviceStore.limit !== DEVICE_ITEMS_DESKTOP_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_DESKTOP_LIMIT);
    } else {
      if (deviceStore.limit !== DEVICE_ITEMS_MOBILE_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_MOBILE_LIMIT);
    }
  }, [deviceStore, windowWidth]);

  useClosingAllWindows();
  return (
    <div className="display-grid" ref={pageRef}>
      <div className="sort-and-filter-bar-wrap">
        {windowWidth < WIDTH_TO_SHOW_ASIDE &&
          <TopFilterBar />
        }
        <Dropdown
          variant="sorting-filter"
          options={sortingOptions}
          paramKey="sort"
          className="device-sorting-filter"
        />
      </div>
      <div id="wrapper">
        <Aside />
        <DeviceSection />
      </div>
    </div>
  );
};

export default CatalogPage;
