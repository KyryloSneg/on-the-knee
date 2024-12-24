import "./styles/CatalogPage.css";
import Dropdown from "../components/UI/dropdown/Dropdown";
import TopFilterBar from "../components/TopFilterBar";
import useWindowWidth from "../hooks/useWindowWidth";
import { WIDTH_TO_SHOW_ASIDE, sortingOptions } from "../utils/consts";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import CatalogAside from "../components/CatalogAside";
import useDeviceSectionFetching from "../hooks/useDeviceSectionFetching";
import URLActions from "../utils/URLActions";
import { observer } from "mobx-react-lite";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import { useLocation, useParams } from "react-router-dom";
import CustomScrollbar from "../components/UI/customScrollbar/CustomScrollbar";
import useDeletingRedundantCategoryId from "../hooks/useDeletingRedundantCategoryId";
import _ from "lodash";
import ChildItemGroupsBar from "../components/ChildItemGroupsBar";
import DeviceOrSalesSection from "components/DeviceOrSalesSection";
import useGettingPaginationParams from "hooks/useGettingPaginationParams";
import getTotalPages from "utils/getTotalPages";

const POSSIBLE_TYPES = ["category", "search", "seller"];

const CatalogPage = observer(({ type, seller = null }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined or incorrect");

  const location = useLocation();
  const { categoryIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();
  const { deviceStore, fetchRefStore, isTest } = useContext(Context);
  const windowWidth = useWindowWidth();

  const isInitialRenderRef = useRef(true);

  const [isFoundDevicesByQuery, setIsFoundDevicesByQuery] = useState(true);
  const [spellCheckedQuery, setSpellCheckedQuery] = useState(type === "search" ? URLActions.getParamValue("text") : null);

  const categoryId = categoryIdSlug?.split("--")[0] || undefined;
  const category = deviceStore.categories.find(cat => cat.id === categoryId);
  const childCategories = deviceStore.categories.filter(cat => !cat.isVariation && cat.parentCategoryId === categoryId);

  const totalPages = getTotalPages(deviceStore.totalCount, deviceStore.limit);
  useGettingPaginationParams(deviceStore, totalPages);
  
  // some boilerplate that is used for optimization
  const hasAlreadyFetchedDevsWithTheseUsedFilters = _.isEqual(
    URLActions.getUsedFilters(deviceStore.filters).usedFilters, fetchRefStore.lastDevicesFetchUsedFilters
  );

  const hasAlreadyFetchedDevsWithThisSortFilter = (
    URLActions.getParamValue("sort") === fetchRefStore.lastDevicesFetchSortFilter
  );

  const hasAlreadyFetchedDevsWithThesePageFilters = (
    fetchRefStore.lastDevicesFetchPageFiltersObj.page === deviceStore.page
    && fetchRefStore.lastDevicesFetchPageFiltersObj.pagesToFetch === deviceStore.pagesToFetch
  );

  const hasAlreadyFetchedWithTheseFilters = (
    hasAlreadyFetchedDevsWithTheseUsedFilters 
    && hasAlreadyFetchedDevsWithThisSortFilter
    && hasAlreadyFetchedDevsWithThesePageFilters
  );

  // show the wrapper immediately if user has returned to the same page after, for example, visiting device page
  const hasAlreadyFetchedThisCategory = (
    type === "category" && `${categoryId}` === fetchRefStore.lastDevicesFetchCategoryId 
    && hasAlreadyFetchedWithTheseFilters
  );

  const hasAlreadyFetchedThisSearch = (
    type === "search" && spellCheckedQuery === fetchRefStore.lastDevicesFetchSearch 
    && hasAlreadyFetchedWithTheseFilters
  );

  const hasAlreadyFetchedThisSeller = (
    type === "seller" && seller?.id === fetchRefStore.lastDevicesFetchSellerId 
    && hasAlreadyFetchedWithTheseFilters
  );

  const isToFetchDevices = !hasAlreadyFetchedThisCategory && !hasAlreadyFetchedThisSearch && !hasAlreadyFetchedThisSeller;

  // we have no need in categoryId param if we're already at the category catalog page
  useDeletingRedundantCategoryId(type);
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
      navigate(url.replace(basename, ""), { replace: true, preventScrollReset: true });
    }

  }, [location.search, deviceStore, deviceStore.filters, location.pathname, navigate, isTest]);

  const [isLoading, error, deviceFetching] = useDeviceSectionFetching(
    type, setIsFoundDevicesByQuery, setSpellCheckedQuery, seller, isToFetchDevices
  );

  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  if (error) console.log(error);

  if (!isFoundDevicesByQuery && type === "search") {
    return (
      <main>
        <div className="display-grid">
          {/* amazon copy + paste */}
          <p className="wrong-search-query-p">
            <span>No results for «<span className="wrong-search-query-span">{spellCheckedQuery}</span>».</span>
            <span>Try checking your spelling or use more general terms</span>
          </p>
        </div>
      </main>
    );
  }

  const isToRenderFilters = !!Object.keys(deviceStore.filters).length;
  const wrapperClassName = !isToRenderFilters ? "no-catalog-aside" : "";

  const defaultSortingFilterDropdownId = sortingOptions.find(option => 
    option.value === fetchRefStore.lastDevicesFetchSortFilter
  )?.id || null;

  return (
    <div className="display-grid">
      {(!!deviceStore.devices.length && type === "search")
        ? <p className="spell-checked-query-p">Devices by query «<span>{spellCheckedQuery}</span>»</p>
        : (type === "search") && <div className="spell-checked-p-placeholder" />
      }
      {type === "category" && <h2 className="top-h2">{category.name}</h2>}
      <div className="sort-and-filter-bar-wrap">
        {(windowWidth < WIDTH_TO_SHOW_ASIDE && isToRenderFilters) &&
          <TopFilterBar />
        }
        <Dropdown
          variant="sorting-filter"
          options={sortingOptions}
          paramKey="sort"
          className="device-sorting-filter"
          propsSelectedId={defaultSortingFilterDropdownId}
        />
      </div>
      {(type === "category" && !!childCategories.length) &&
        <CustomScrollbar
          children={<ChildItemGroupsBar type="categories" childItemGroups={childCategories} />}
          className="child-item-groups-scrollbar"
        />
      }
      {(
        !isInitialRenderRef.current || hasAlreadyFetchedThisCategory 
        || hasAlreadyFetchedThisSearch || hasAlreadyFetchedThisSeller
      ) &&
        <div id="wrapper" className={wrapperClassName}>
          {isToRenderFilters &&
            <CatalogAside key={"aside"} />
          }
          <DeviceOrSalesSection 
            type="devices"
            retryFetching={deviceFetching}
            isLoading={isLoading}
            error={error}
            isInitialRenderRef={isInitialRenderRef}
            key={"devSection"}
          />
        </div>
      }
    </div>
  );
});

export default CatalogPage;
