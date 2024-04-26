import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import "./styles/CatalogPage.css";
import useWindowWidth from "../hooks/useWindowWidth";
import DeviceSection from "../components/DeviceSection";
import { WIDTH_TO_SHOW_ASIDE, sortingOptions } from "../utils/consts";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import CatalogAside from "../components/CatalogAside";
import useDeviceSectionFetching from "../hooks/useDeviceSectionFetching";
import URLActions from "../utils/URLActions";
import { observer } from "mobx-react-lite";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import { useLocation, useParams } from "react-router-dom";
import ChildCategoriesBar from "../components/ChildCategoriesBar";
import CustomScrollbar from "../components/UI/customScrollbar/CustomScrollbar";

const POSSIBLE_TYPES = ["category", "search"];

const CatalogPage = observer(({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined");

  const location = useLocation();
  const { categoryIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();
  const { deviceStore, app, isTest } = useContext(Context);
  const pageRef = useRef(null);
  const windowWidth = useWindowWidth();
  const [isFoundDevicesByQuery, setIsFoundDevicesByQuery] = useState(true);
  const [spellCheckedQuery, setSpellCheckedQuery] = useState(type === "search" ? URLActions.getParamValue("text") : null);

  const categoryId = +categoryIdSlug?.split("-")[0] || undefined;
  const category = deviceStore.categories.find(cat => cat.id === categoryId);
  const childCategories = deviceStore.categories.filter(cat => !cat.isVariation && cat.parentCategoryId === categoryId);

  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app, windowWidth]);

  useEffect(() => {
    const { usedFilters, url } = URLActions.getUsedFilters(deviceStore.filters);
    deviceStore.setUsedFilters(usedFilters);

    // if the url changed (for example if there's some not existing key or value)
    // we change it to normal one without redundant query params

    // router from the tests seems to not work with navigate() function,
    // so it's better to skip the block below
    const basename = process.env.REACT_APP_CLIENT_URL;
    const currentUrl = basename + location.pathname + location.search;

    if (currentUrl !== url && !isTest) { 
      navigate(url.replace(basename, ""), { replace: true });
    }

  }, [location.search, deviceStore, deviceStore.filters, deviceStore.filters, location.pathname, navigate, isTest]);
  
  const [isLoading, error, deviceFetching] = useDeviceSectionFetching(deviceStore, app, type, setIsFoundDevicesByQuery, setSpellCheckedQuery);
  if (error) console.log(error);

  if (!isFoundDevicesByQuery && type === "search") {
    return (
      <main>
        <div className="display-grid" ref={pageRef}>
          {/* amazon copy + paste */}
          <p className="wrong-search-query-p">
            <span>No results for «<span className="wrong-search-query-span">{spellCheckedQuery}</span>».</span>
            <span>Try checking your spelling or use more general terms</span>
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="display-grid" ref={pageRef}>
      {(!!deviceStore.devices.length && type === "search")
        ? <p className="spell-checked-query-p">Devices by query «<span>{spellCheckedQuery}</span>»</p>
        : (type === "search") && <div className="spell-checked-p-placeholder" />
      }
      {type === "category" && <h2 className="category-name-heading">{category.name}</h2>}
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
      {(type === "category" && !!childCategories.length) && 
        <CustomScrollbar 
          children={<ChildCategoriesBar 
          childCategories={childCategories} />} 
          className="child-categories-scrollbar" 
        />
      }
      <div id="wrapper">
        <CatalogAside key={"aside"} />
        <DeviceSection isLoading={isLoading} retryDevicesFetch={deviceFetching} error={error} key={"devSection"} />
      </div>
    </div>
  );
});

export default CatalogPage;
