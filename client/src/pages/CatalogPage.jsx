import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import "./styles/CatalogPage.css";
import useWindowWidth from "../hooks/useWindowWidth";
import DeviceSection from "../components/DeviceSection";
import { DEVICE_ITEMS_DESKTOP_LIMIT, DEVICE_ITEMS_MOBILE_LIMIT, WIDTH_TO_SHOW_ASIDE, sortingOptions } from "../utils/consts";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import useClosingAllWindows from "../hooks/useClosingAllWindows";
import CatalogAside from "../components/CatalogAside";
import useDeviceSectionFetching from "../hooks/useDeviceSectionFetching";
import URLActions from "../utils/URLActions";

const POSSIBLE_TYPES = ["category", "brand", "search"];

const CatalogPage = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined");

  const { deviceStore, app } = useContext(Context);
  const pageRef = useRef(null);
  const windowWidth = useWindowWidth();
  const [isFoundDevicesByQuery, setIsFoundDevicesByQuery] = useState(true);
  const [spellCheckedQuery, setSpellCheckedQuery] = useState(type === "search" ? URLActions.getParamValue("text") : null);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app, windowWidth]);

  const [isLoading, error, deviceFetching] = useDeviceSectionFetching(deviceStore, app, type, setIsFoundDevicesByQuery, setSpellCheckedQuery);
  if (error) console.log(error);

  useEffect(() => {
    if (windowWidth > 820) {
      if (deviceStore.limit !== DEVICE_ITEMS_DESKTOP_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_DESKTOP_LIMIT);
    } else {
      if (deviceStore.limit !== DEVICE_ITEMS_MOBILE_LIMIT) deviceStore.setLimit(DEVICE_ITEMS_MOBILE_LIMIT);
    }
  }, [deviceStore, windowWidth]);

  useClosingAllWindows();
  if (!isFoundDevicesByQuery && type === "search") {
    return (
      <div className="display-grid" ref={pageRef}>
        {/* amazon copy + paste */}
        <p className="wrong-search-query-p">
          <span>No results for «<span className="wrong-search-query-span">{spellCheckedQuery}</span>».</span>
          <span>Try checking your spelling or use more general terms</span>
        </p>
      </div>
    );
  }

  return (
    <div className="display-grid" ref={pageRef}>
      {(!!deviceStore.devices.length && type === "search")
        ? <p className="spell-checked-query-p">Devices by query «<span>{spellCheckedQuery}</span>»</p>
        : (type === "search") && <div className="spell-checked-p-placeholder" />
      }
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
        <CatalogAside key={"aside"} />
        <DeviceSection isLoading={isLoading} retryDevicesFetch={deviceFetching} error={error} key={"devSection"} />
      </div>
    </div>
  );
};

export default CatalogPage;
