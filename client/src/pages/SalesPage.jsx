import "./styles/SalesPage.css";
import ChildItemGroupsBar from "components/ChildItemGroupsBar";
import CustomScrollbar from "components/UI/customScrollbar/CustomScrollbar";
import { Context } from "Context";
import useGettingPaginationParams from "hooks/useGettingPaginationParams";
import useSalesPageFetching from "hooks/useSalesPageFetching";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ALL_SALES_SLUG, SALES_ROUTE } from "utils/consts";
import getTotalPages from "utils/getTotalPages";
import DeviceOrSalesSection from "components/DeviceOrSalesSection";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import ApiError from "utils/ApiError";
import MetaTagsInPublicRoute from "components/MetaTagsInPublicRoute";

const SalesPage = observer(() => {
  const { salesPageStore, deviceStore, fetchRefStore } = useContext(Context);
  const { slug } = useParams();
  const isInitialRenderRef = useRef(true);

  const totalPages = getTotalPages(salesPageStore.totalCount, salesPageStore.limit);
  useGettingPaginationParams(salesPageStore, totalPages);

  const hasAlreadyFetchedSalesWithThisSlug = fetchRefStore.lastSalesPageSlug === slug;
  const hasAlreadyFetchedSalesWithThesePageFilters = (
    fetchRefStore.lastSalesPageFetchPageFiltersObj.page === salesPageStore.page
    && fetchRefStore.lastSalesPageFetchPageFiltersObj.pagesToFetch === salesPageStore.pagesToFetch
  );

  const isToFetchSales = !hasAlreadyFetchedSalesWithThisSlug || !hasAlreadyFetchedSalesWithThesePageFilters;

  const [fetching, isLoading, error] = useSalesPageFetching(slug, isToFetchSales);
  const saleTypeNamesWithoutCurrentOne = deviceStore.saleTypeNames?.filter(item => item.name !== slug);

  // if slug is incorrect, throw a 404 error
  if (
    slug !== ALL_SALES_SLUG
    && (deviceStore.saleTypeNames?.length && saleTypeNamesWithoutCurrentOne?.length) 
    && (deviceStore.saleTypeNames?.length === saleTypeNamesWithoutCurrentOne?.length)
  ) throw ApiError.NotFoundError();

  const headingContent = (
    salesPageStore.selectedSaleTypeName
      ? `${salesPageStore.selectedSaleTypeName.nameToRender} sales`
      : "Sales"
  );

  useSettingDocumentTitle(headingContent);
  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  const possibleNameToRender = salesPageStore.selectedSaleTypeName?.nameToRender;
  const keywords = possibleNameToRender ? `sales, ${possibleNameToRender}` : "sales";

  return (
    <div className="display-grid">
      <MetaTagsInPublicRoute 
        description={`${headingContent} in On the knee store. Favorable prices $, huge discounts %`} 
        keywords={keywords}
      />
      <h2 className="top-h2">
        {headingContent}
      </h2>
      <nav>
        {slug !== ALL_SALES_SLUG
          ? (
            <Link to={SALES_ROUTE + ALL_SALES_SLUG + "?page=1&pagesToFetch=1"} className="sales-page-return-to-all-link link-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                <path d="M360-216 96-480l264-264 51 51-177 177h630v72H234l177 177-51 51Z" />
              </svg>
              Return to all sales
            </Link>
          ) : <div className="sales-page-return-to-all-link-placeholder" />
        }
        {(!!saleTypeNamesWithoutCurrentOne?.length) &&
          <CustomScrollbar
            children={<ChildItemGroupsBar type="sales" childItemGroups={saleTypeNamesWithoutCurrentOne} />}
            className="child-item-groups-scrollbar"
          />
        }
      </nav>
      <DeviceOrSalesSection
        type="sales"
        retryFetching={fetching}
        isLoading={isLoading}
        error={error}
        isInitialRenderRef={isInitialRenderRef}
      />
    </div>
  );
});

export default SalesPage;
