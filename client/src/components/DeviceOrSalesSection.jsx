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

const POSSIBLE_TYPES = ["devices", "seller", "sales", "saleDevices"];

// isTopElemMain ? main element is used as the top one in the jsx : section elem is used;
const DeviceOrSalesSection = observer(({ 
  type, retryFetching, isLoading, error, isInitialRenderRef, isTopElemMain = true, ...props 
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of DeviceOrSalesSection is not defined or incorrect");

  const { app, deviceStore, sellerDevicesPageStore, salesPageStore, oneSalePageStore } = useContext(Context);
  const sectionRef = useRef(null);

  async function onRetryFetch() {
    await retryFetching();
  }

  useEffect(() => {
    if (type === "devices") app.setDeviceSectionRef(sectionRef);
  }, [app, deviceStore.devices, type]);

  let storeToUse;
  if (type !== "seller" && type !== "sales" && type !== "saleDevices") {
    storeToUse = deviceStore;
  } else if (type === "sales") {
    storeToUse = salesPageStore;
  } else if (type === "seller") {
    storeToUse = sellerDevicesPageStore;
  } else if (type === "saleDevices") {
    storeToUse = oneSalePageStore;
  }
  
  function renderItemsRelatedJsx() {
    let content = <div />;

    if (type !== "sales") {
      if (allItems.length) {
        content = <DevicePageList storeToUse={storeToUse} />;
      } else if (!isInitialRenderRef.current && !error && !!Object.keys(storeToUse.usedFilters).length && !isLoading) {
        content = (
          <p className="no-devices-or-sales-message">
            We haven't found devices with such filters {":("}
          </p>
        );
      }
    } else {
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
  let itemsNameToRender = "";
  let pagesPaginationAriaLabel = "Pages";

  if (type !== "sales") {  
    allItems = storeToUse.devices;
    itemsNameToRender = "devices"

    pagesPaginationAriaLabel = "Device pages";
  } else {
    allItems = salesPageStore.filteredSales;
    itemsNameToRender = "sales"

    pagesPaginationAriaLabel = "Sale pages";
  }

  const totalPages = getTotalPages(storeToUse.totalCount, storeToUse.limit);
  const canLoadMore = isCanLoadMoreContent(
    storeToUse.totalCount,
    allItems.length,
    (storeToUse.page - 1) * storeToUse.limit
  );

  const topElemContent = (
    <>
      {renderItemsRelatedJsx()}
      {/* spinner on "retry" fetch */}
      {(error && isLoading) &&
        <Loader className="error-retry-spinner" />
      }
      {/* create "try again" btn */}
      {(!!error && !isLoading) &&
        <div className="device-or-sales-section-error">
          <p>
            Oops! Something went wrong while getting {itemsNameToRender}.
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
          pagesToFetch={storeToUse.pagesToFetch}
          nameToRender={itemsNameToRender}
        />
      }
      {/* if devices are fetched and we've got totalCount (usually these conditions returns true at the same moment) */}
      {/* besides, show the pagination below only if there's a COUPLE of pages */}
      {(!!(+storeToUse.totalCount) && !!allItems.length && totalPages > 1) &&
        <PagesPagination
          totalPages={totalPages}
          currentPage={storeToUse.page}
          pagesToFetch={storeToUse.pagesToFetch}
          ariaLabel={pagesPaginationAriaLabel}
        />
      }
    </>
  );

  if (isTopElemMain) {
    return (
      <main className="device-or-sales-section-main" ref={sectionRef} {...props}>
        {topElemContent}
      </main>
    );
  }

  return (
    <section className="device-or-sales-section-main" ref={sectionRef} {...props}>
      {topElemContent}
    </section>
  );
});

export default DeviceOrSalesSection;
