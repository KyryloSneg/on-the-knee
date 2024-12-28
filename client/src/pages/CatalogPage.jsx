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

const POSSIBLE_TYPES = ["category", "search", "seller", "saleDevices"];

const CatalogPage = observer(({ type, seller = null, sale = null, isTopElemMain = false }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined or incorrect");

  const location = useLocation();
  const { categoryIdSlug } = useParams();
  const navigate = useNavigateToEncodedURL();
  const { deviceStore, oneSalePageStore, fetchRefStore, isTest } = useContext(Context);
  const windowWidth = useWindowWidth();

  const isInitialRenderRef = useRef(true);

  const [isFoundDevicesByQuery, setIsFoundDevicesByQuery] = useState(true);
  const [spellCheckedQuery, setSpellCheckedQuery] = useState(type === "search" ? URLActions.getParamValue("text") : null);

  const categoryId = categoryIdSlug?.split("--")[0] || undefined;
  const category = deviceStore.categories.find(cat => cat.id === categoryId);
  const childCategories = deviceStore.categories.filter(cat => !cat.isVariation && cat.parentCategoryId === categoryId);

  let storeToUse;
  let deviceOrSalesSectionType;

  let lastUsedFilters;
  let lastPageFiltersObj;
  let lastSortFilter;

  if (type !== "saleDevices") {
    storeToUse = deviceStore;
    deviceOrSalesSectionType = "devices";

    lastUsedFilters = fetchRefStore.lastDevicesFetchUsedFilters;
    lastSortFilter = fetchRefStore.lastDevicesFetchSortFilter;
    lastPageFiltersObj = fetchRefStore.lastDevicesFetchPageFiltersObj;
  } else {
    storeToUse = oneSalePageStore;
    deviceOrSalesSectionType = "saleDevices";

    lastUsedFilters = fetchRefStore.lastSaleDevicesFetchUsedFilters;
    lastSortFilter = fetchRefStore.lastSaleDevicesFetchSortFilter;
    lastPageFiltersObj = fetchRefStore.lastSaleDevicesFetchPageFiltersObj;
  }
  
  const totalPages = getTotalPages(storeToUse.totalCount, storeToUse.limit);
  useGettingPaginationParams(storeToUse, totalPages);
  
  // some boilerplate that is used for optimization
  const hasAlreadyFetchedDevsWithTheseUsedFilters = _.isEqual(
    URLActions.getUsedFilters(storeToUse.filters).usedFilters, lastUsedFilters
  );

  const hasAlreadyFetchedDevsWithThisSortFilter = URLActions.getParamValue("sort") === lastSortFilter;
  const hasAlreadyFetchedDevsWithThesePageFilters = (
    lastPageFiltersObj.page === storeToUse.page
    && lastPageFiltersObj.pagesToFetch === storeToUse.pagesToFetch
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

  const hasAlreadyFetchedThisSale = (
    type === "saleDevices" && sale?.id === fetchRefStore.lastDevicesFetchSaleId 
    && hasAlreadyFetchedWithTheseFilters
  );

  const isToFetchDevices = (
    !hasAlreadyFetchedThisCategory && !hasAlreadyFetchedThisSearch && !hasAlreadyFetchedThisSeller && !hasAlreadyFetchedThisSale
  );

  // we have no need in categoryId param if we're already at the category catalog page
  useDeletingRedundantCategoryId(type);
  useEffect(() => {
    const { usedFilters, url } = URLActions.getUsedFilters(storeToUse.filters);
    storeToUse.setUsedFilters(usedFilters);

    // if the url changed (for example if there's some not existing key or value)
    // we change it to normal one without redundant query params

    // router from the tests seems to not work with navigate() function,
    // so it's better to skip the block below
    const basename = process.env.REACT_APP_CLIENT_URL;
    const currentUrl = basename + location.pathname + location.search;

    if (currentUrl !== url && !isTest) {
      navigate(url.replace(basename, ""), { replace: true, preventScrollReset: true });
    }

  }, [location.search, storeToUse, storeToUse.filters, location.pathname, navigate, isTest]);

  const [isLoading, error, deviceFetching] = useDeviceSectionFetching(
    type, setIsFoundDevicesByQuery, setSpellCheckedQuery, seller, sale, isToFetchDevices
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

  const isToRenderFilters = !!Object.keys(storeToUse.filters).length;
  const wrapperClassName = !isToRenderFilters ? "no-catalog-aside" : "";

  const defaultSortingFilterDropdownId = sortingOptions.find(option => 
    option.value === lastSortFilter
  )?.id || null;

  const topElemContent = (
    <>
      {(!!storeToUse.devices.length && type === "search")
        ? <p className="spell-checked-query-p">Devices by query «<span>{spellCheckedQuery}</span>»</p>
        : (type === "search") && <div className="spell-checked-p-placeholder" />
      }
      {type === "category" && <h2 className="top-h2">{category.name}</h2>}
      <div className="sort-and-filter-bar-wrap">
        {(windowWidth < WIDTH_TO_SHOW_ASIDE && isToRenderFilters) &&
          <TopFilterBar storeToUse={storeToUse} />
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
        || hasAlreadyFetchedThisSale
      ) &&
        <div id="wrapper" className={wrapperClassName}>
          {isToRenderFilters &&
            <CatalogAside storeToUse={storeToUse} key={"aside"} />
          }
          <DeviceOrSalesSection 
            type={deviceOrSalesSectionType}
            retryFetching={deviceFetching}
            isLoading={isLoading}
            error={error}
            isInitialRenderRef={isInitialRenderRef}
            isTopElemMain={type !== "seller"}
            key={"devSection"}
          />
        </div>
      }
    </>
  );

  if (isTopElemMain) {
    return (
      <main className="display-grid">
        {topElemContent}
      </main>
    ); 
  }

  return (
    <div className="display-grid">
      {topElemContent}
    </div>
  );
});

export default CatalogPage;
