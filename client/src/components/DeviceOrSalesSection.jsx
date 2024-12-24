import "./styles/DeviceOrSalesSection.css";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef } from "react";
import { Context } from "Context";
import DevicePageList from "./DevicePageList";
import Loader from "./UI/loader/Loader";
import ButtonPagination from "./UI/pagination/ButtonPagination";
import PagesPagination from "./UI/pagination/PagesPagination";
import SalesPageList from "./SalesPageList";
import getTotalPages from "utils/getTotalPages";
import isCanLoadMoreContent from "utils/isCanLoadMoreContent";

const POSSIBLE_TYPES = ["devices", "sales"];

const DeviceOrSalesSection = observer(({ 
  type, retryFetching, isLoading, error, isInitialRenderRef, ...props 
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of DeviceOrSalesSection is not defined or incorrect");

  const { app, deviceStore, salesPageStore } = useContext(Context);
  const sectionRef = useRef(null);

  async function onRetryFetch() {
    await retryFetching();
  }

  useEffect(() => {
    if (type === "devices") app.setDeviceSectionRef(sectionRef);
  }, [app, deviceStore.devices, type]);

  function renderItemsRelatedJsx() {
    let content = <div />;

    if (type === "devices") {
      if (allItems.length) {
        content = <DevicePageList />;
      } else if (!isInitialRenderRef.current && !error && !!Object.keys(deviceStore.usedFilters).length && !isLoading) {
        content = (
          <p className="no-devices-or-sales-message">
            We haven't found devices with such filters {":("}
          </p>
        );
      }
    } else if (type === "sales") {
      if (allItems.length) {
        content = <SalesPageList />;
      } else if (!isInitialRenderRef.current && !error && !isLoading) {
        content = (
          <p className="no-devices-or-sales-message">
            We haven't found any sales {":("}
          </p>
        );
      }
    }

    return content;
  }

  let allItems = [];
  let paginationInfoStore = null;
  let pagesPaginationAriaLabel = "Pages";

  if (type === "devices") {
    allItems = deviceStore.devices;

    paginationInfoStore = deviceStore;
    pagesPaginationAriaLabel = "Device pages";
  } else if (type === "sales") {
    allItems = salesPageStore.filteredSales;

    paginationInfoStore = salesPageStore;
    pagesPaginationAriaLabel = "Sale pages";
  }

  const totalPages = getTotalPages(paginationInfoStore.totalCount, paginationInfoStore.limit);
  const canLoadMore = isCanLoadMoreContent(
    paginationInfoStore.totalCount,
    allItems.length,
    (paginationInfoStore.page - 1) * paginationInfoStore.limit
  );

  return (
    <main className="device-or-sales-section-main" ref={sectionRef} {...props}>
      {renderItemsRelatedJsx()}
      {/* spinner on "retry" fetch */}
      {(error && isLoading) &&
        <Loader className="error-retry-spinner" />
      }
      {/* create "try again" btn */}
      {(!!error && !isLoading) &&
        <div className="device-or-sales-section-error">
          <p>
            Oops! Something went wrong while getting devices.
          </p>
          <p>
            <button className="link-colors" onClick={onRetryFetch}>
              Try again
            </button> or visit our store later on.
          </p>
        </div>
      }
      {/* using "!!" to prevent "0" appearing instead of empty space */}
      {/* if there's more devices to load and devices are fetched */}
      {(!!canLoadMore && !!allItems.length) &&
        <ButtonPagination
          isLoading={isLoading}
          pagesToFetch={paginationInfoStore.pagesToFetch}
        />
      }
      {/* if devices are fetched and we've got totalCount (usually these conditions returns true at the same moment) */}
      {(!!(+paginationInfoStore.totalCount) && !!allItems.length) &&
        <PagesPagination
          totalPages={totalPages}
          currentPage={paginationInfoStore.page}
          pagesToFetch={paginationInfoStore.pagesToFetch}
          ariaLabel={pagesPaginationAriaLabel}
        />
      }
    </main>
  );
});

export default DeviceOrSalesSection;
