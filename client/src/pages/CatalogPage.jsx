import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import Aside from "../components/Aside";
import "./styles/CatalogPage.css";
import useWindowWidth from "../hooks/useWindowWidth";
import DeviceSection from "../components/DeviceSection";
import { useOutletContext } from "react-router-dom";
import { DEVICE_ITEMS_DESKTOP_LIMIT, DEVICE_ITEMS_MOBILE_LIMIT, sortingOptions } from "../utils/consts";
import { useContext, useEffect } from "react";
import { Context } from "../Context";

const CatalogPage = () => {
  const { deviceStore } = useContext(Context);
  const { pageRef } = useOutletContext();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth > 820) {
      if (deviceStore.limit !== DEVICE_ITEMS_DESKTOP_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_DESKTOP_LIMIT);
    } else {
      if (deviceStore.limit !== DEVICE_ITEMS_MOBILE_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_MOBILE_LIMIT);
    }
  }, [deviceStore, windowWidth]);

  return (
    <div className="display-grid">
      {/* if window width is bigger than 960px, clicking the "skip to next page content" btn
       in navbar will focus the top filter bar else dropdown */}
      {windowWidth >= 960 
        ? (
          <div className="ref-purpose-only display-grid">
            <Dropdown 
              variant="sorting-filter" 
              options={sortingOptions} 
              paramKey="sort" 
              ref={pageRef} 
            />
          </div>
        )
        : (
          <div className="ref-purpose-only display-grid">
            <TopFilterBar ref={pageRef} />
            <Dropdown 
              variant="sorting-filter"
              options={sortingOptions}  
              paramKey="sort"
            />
          </div>
        )
      }
      <div id="wrapper">
        <Aside />
        {/* TODO: setting deviceSectionRef in useEffect of DeviceSection */}
        <DeviceSection />
      </div>
    </div>
  );
};

export default CatalogPage;
